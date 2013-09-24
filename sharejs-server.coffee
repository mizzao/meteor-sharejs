# Creates a (persistent) ShareJS server
# Roughly copied from https://github.com/share/ShareJS/wiki/Getting-started

Future = Npm.require('fibers/future')

logPrefix = "ShareJS:"

# See docs for options. Uses mongo by default to enable persistence, but redis also supported.

# Using special options from https://github.com/share/ShareJS/blob/master/src/server/index.coffee
options = _.extend {
  db: {type: 'mongo'} # Default option is Mongo because Meteor provides it
  staticPath: null # Meteor is serving up this application
  # rest: null # disable REST interface?
}, Meteor.settings.sharejs?.options

switch options.db.type
  when 'mongo'
    ###
      ShareJS 0.6.2 mongo driver:
      https://github.com/share/ShareJS/blob/v0.6.2/src/server/db/mongo.coffee
      It will create its own indices on the 'ops' collection.
    ###
    connection = MongoInternals.defaultRemoteCollectionDriver().mongo

    # Wait until we're connected to pass this to ShareJS
    future = new Future
    connection._withDb (db) -> future.return(db)
    client = future.wait()
    options.db.client = client

#    oldOpen = client::open
#    client.open = ->
#      console.log "wtf"
#      return oldOpen.apply(this, arguments)
#
#    console.log client.open

    Meteor._debug logPrefix, "Using Meteor's mongo for persistence."

  when 'redis'
    ###
      ShareJS 0.6.2 redis support
      https://github.com/share/ShareJS/blob/v0.6.2/src/server/db/redis.coffee
    ###
    try
      redis = Npm.require('redis')

      client = redis.createClient(options.db.port, options.db.host) # (port, host, options): defaults to 6379, 127.0.0.1
      client.on "error", (err) ->
        Meteor._debug logPrefix, "Error connecting to redis: " + err

      options.db.client = client

      Meteor._debug logPrefix, "Redis persistence is enabled."
    catch e
      Meteor._debug logPrefix, "Error loading redis module: " + e

  else
    Meteor._debug logPrefix, "using unsupported db type " + options.db.type + ", falling back to in-memory."

# Declare the path that ShareJS uses to Meteor
RoutePolicy.declare('/connect', 'network');

# Attach the sharejs REST and Socket.io interfaces as middleware to the meteor connect server
sharejs = Npm.require('share').server
sharejs.attach(WebApp.connectHandlers, options);
