# Auth API helpers
Fiber = Npm.require('fibers');
Future = Npm.require('fibers/future')


# Metaprogramming aids
LogicalOps =
    'or'  : (a, b) -> a or b
    'and' : (a, b) -> a and b

# Recursively evaluate the validations provided in settings.json
runValidations = (currentOp, validations, doc, token) ->
  if currentOp is null
    if validations?.or?
      # recurse into or
      return runValidations("or", validations.or, doc, token)
    else if validations?.and?
      # recurse into and
      return runValidations("and", validations.and, doc, token)
    else if validations?
      # If no higher level "or" and "and", default to "and"
      return runValidations("and", validations, doc, token)
    else
      # No validations being asked to run - user possibly just wants to check
      # for presence of user/doc
      return true
  else if currentOp?
    if currentOp is "or"
      result = false
    else if currentOp = "and"
      result = true

    for k, v of validations
      if k in ["or", "and"]
        # recurse into or/and
        nestedResult = runValidations(k, v, doc, token)
        result = LogicalOps[currentOp](result, nestedResult)
      else
        switch v
          when "is_in_array"
            result = LogicalOps[currentOp](result, token in doc[k])
          when "isnt_in_array"
            lookIn = doc.k or []
            result = LogicalOps[currentOp](result, token not in doc[k])
          when "is_equal"
            result = LogicalOps[currentOp](result, token is doc[k])
          when "isnt_equal"
            result = LogicalOps[currentOp](result, token is not doc[k])
    return result

# Get a future that resolves to the entry from the database for given query
fetchEntryFromDatabase = ((options, dbClient, dbType, query) ->
  collectionName = options.criteria.collection 

  future = new Future
  switch dbType
    when 'mongo'
      dbClient.collection collectionName, (err, collection) ->
        return future.throw err if err
        docCursor = collection.find({_id: query})
        docCursor.toArray (err, docs) ->
          console.warn "failed to get docs for #{docName}: #{err}" if err
          future.throw null if err
          for doc in docs
            # return first one, should be the only one
           future.return(doc)
  return future)


# Get a future that resolves to the user from the database using user-defined collection
getUser = (agent, options, dbClient, dbType) ->
  return fetchEntryFromDatabase(options, dbClient, dbType, agent.authentication)

# Get a future that resolves to the document from the database using user-defined collection
getDocument = (action, options, dbClient, dbType) ->
  return fetchEntryFromDatabase(options, dbClient, dbType, action.docName)

# Get a future that would resolve to authentication as a bool
getAuthentication = (agent, action, options, dbClient, dbType) ->
  token = agent.authentication
  validations = options.criteria.token_validations

  future = new Future

  user = getUser(agent, options, dbClient, dbType).wait()
  # Not having user necessitates bailing out!
  # Having both "and" and "or" on the top level is not allowed
  unless user? or (validations.or? and validations.and?)
    future.return false

  future.return runValidations(null, validations, user, token)

  return future

# Get a future that would resolve to authorization as a bool
getAuthorization = (agent, action, options, dbClient, dbType) ->
  token = agent.authentication
  validations = options.criteria.token_validations

  future = new Future

  doc = getDocument(action, options, dbClient, dbType).wait()
  # Not having document necessitates bailing out!
  # Having both "and" and "or" on the top level is not allowed
  unless doc? or (validations.or? and validations.and?)
    future.return false

  future.return runValidations(null, validations, doc, token)

  return future

# Based on https://github.com/share/ShareJS/wiki/User-access-control
@MeteorShareJsUserAccountsAuthHandler = (agent, action, options, dbClient, dbType) ->
  (Fiber ( ->
    res = false
    authenticate = options.authenticate?
    authorize = options.authorize?
    opsToAuthorize = options.authorize?.criteria.apply_on

    if authenticate and (action.type is "connect")
        res = getAuthentication(agent, action, options.authenticate, dbClient, dbType).wait()
    else if authorize and action.type in opsToAuthorize
      res = getAuthorization(agent, action, options.authorize, dbClient, dbType).wait()
    else
      # Accept all other actions
      res = true

    if res
      action.accept()
    else
      action.reject()
  )).run()

