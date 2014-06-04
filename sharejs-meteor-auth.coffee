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

_submitOpMonkeyPatched = false

_monkeyPatch = (agent) ->
  UserAgent = Object.getPrototypeOf(agent)
  model = ShareJS.model
  # Overriding https://github.com/share/ShareJS/blob/v0.6.2/src/server/useragent.coffee,
  # including variables in closure. >.< @josephg
  UserAgent.submitOp = (docName, opData, callback) ->
    opData.meta ||= {}
    opData.meta.userId = @name
    opData.meta.source = @sessionId
    dupIfSource = opData.dupIfSource or []

    # If ops and meta get coalesced, they should be separated here.
    if opData.op
      @doAuth {docName, op:opData.op, v:opData.v, meta:opData.meta, dupIfSource}, 'submit op', callback, =>
        model.applyOp docName, opData, callback
    else
      @doAuth {docName, meta:opData.meta}, 'submit meta', callback, =>
        model.applyMetaOp docName, opData, callback

  console.log "ShareJS: patched UserAgent submitOp function to record Meteor userId"
  _submitOpMonkeyPatched = true

# Based on https://github.com/share/ShareJS/wiki/User-access-control
class @MeteorAccountsAuthHandler
  constructor: (@options, @client) ->

  # Get a future that resolves to the entry from the database for given query
  fetchDocument: (collection, key) ->
    future = new Future
    @client.collection collection, (err, collection) ->
      return future.throw(err) if err

      collection.findOne {_id: key}, (err, doc) ->
        console.warn "failed to get doc in #{collection} with key #{key}: #{err}" if err
        future.throw(null) if err
        future.return(doc)

    return future

  # Get a future that would resolve to authentication as a bool
  getAuthentication: (agent) ->
    token = agent.authentication
    validations = @options.authenticate.token_validations
    collection = @options.authenticate.collection

    future = new Future

    user = @fetchDocument(collection, agent.authentication).wait()
    # Not having user necessitates bailing out!
    # Having both "and" and "or" on the top level is not allowed
    unless user? or (validations.or? and validations.and?)
      future.return false

    future.return runValidations(null, validations, user, token)

    return future

  # Get a future that would resolve to authorization as a bool
  getAuthorization: (agent, action) ->
    token = agent.authentication
    validations = @options.authorize.token_validations
    collection = @options.authorize.collection

    future = new Future

    doc = @fetchDocument(collection, action.docName).wait()
    # Not having document necessitates bailing out!
    # Having both "and" and "or" on the top level is not allowed
    unless doc? or (validations.or? and validations.and?)
      future.return false

    future.return runValidations(null, validations, doc, token)

    return future

  handle: (agent, action) =>
    # This is ugly, but we have no other way to store Meteor usernames in ShareJS 0.6.2
    _monkeyPatch(agent) unless _submitOpMonkeyPatched

    authenticate = @options.authenticate?
    authorize = @options.authorize?
    opsToAuthorize = @options.authorize?.apply_on

    (Fiber (=>
      res = false

      if authenticate and (action.type is "connect")
        res = @getAuthentication(agent).wait()
        # Save Meteor userId if we successfully authenticated
        agent.name = agent.authentication if res

      else if authorize and action.type in opsToAuthorize
        res = @getAuthorization(agent, action).wait()
      else
        # Accept all other actions
        res = true

      if res
        action.accept()
      else
        action.reject()
    )).run()
