Meteor.startShareJS = ->

  # Creates a (persistent) ShareJS server
  # Roughly copied from https://github.com/share/ShareJS/wiki/Getting-started

  port = Meteor.settings?.public?.sharejs?.port || 3003

  connect = Npm.require('connect')
  sharejs = Npm.require('share').server

  server = connect(
    # connect.logger(),
    # connect.static(__dirname + '/public')
  )

  # See docs for options. {type: 'redis'} to enable persistance.
  options =
    db: {type: 'none'}
    browserChannel: {cors: '*'}

  # Lets try and enable redis persistance if redis is installed...
  try
    Npm.require('redis')
    options.db = {type: 'redis'}
    Meteor._debug "ShareJS: Redis persistence is enabled."
  catch e
    Meteor._debug "ShareJS: Redis module not found. Documents will be in-memory only."

  # Attach the sharejs REST and Socket.io interfaces to the server
  sharejs.attach(server, options);

  server.listen port, ->
    Meteor._debug('ShareJS server running at http://localhost:' + port)
