# Creates a (persistent) ShareJS server
# Roughly copied from https://github.com/share/ShareJS/wiki/Getting-started

# See docs for options. {type: 'redis'} to enable persistance.
# Using special options from https://github.com/share/ShareJS/blob/master/src/server/index.coffee
options = _.extend {
  db: {type: 'none'}
  staticPath: null # Meteor is serving up this application
  # browserChannel: {cors: '*'} # No longer necessary as we are on the same server
  # rest: null # disable REST interface?
}, Meteor.settings.sharejs?.options

# ShareJS 0.6.2 uses redis
# Lets try and enable redis persistance if redis is installed...
if options.db.type is 'redis'
  try
    redis = Npm.require('redis')

    client = redis.createClient(options.db.port, options.db.host) # (port, host, options): defaults to 6379, 127.0.0.1
    client.on "error", (err) ->
      Meteor._debug("ShareJS: Error connecting to redis: " + err)

    options.db =
      type: 'redis'
      client: client

    Meteor._debug "ShareJS: Redis persistence is enabled."
  catch e
    Meteor._debug "ShareJS: Error loading redis module: " + e

else
  Meteor._debug "ShareJS: using db type " + options.db.type

# Attach the sharejs REST and Socket.io interfaces as middleware to the meteor connect server
sharejs = Npm.require('share').server
sharejs.attach(WebApp.connectHandlers, options);
