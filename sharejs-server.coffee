# Creates a (persistent) ShareJS server
# Based on https://github.com/share/ShareJS/wiki/Getting-started
Future = Npm.require('fibers/future')

logPrefix = "ShareJS:"

ShareJS = ShareJS || {}
# See docs for options. Uses mongo by default to enable persistence.

# Using special options from https://github.com/share/ShareJS/blob/master/src/server/index.coffee
options = _.extend {
  staticPath: null # Meteor is serving up this application
  # rest: null # disable REST interface?
  db: {
    # Default option is Mongo because Meteor provides it
    type: 'mongo'
  }
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
    options.db.client = future.wait()

    Meteor._debug logPrefix, "Using Meteor's mongo for persistence."

    if options.accounts_auth?
      options.auth = new MeteorAccountsAuthHandler(options.accounts_auth, options.db.client).handle
  else
    Meteor._debug logPrefix, "using unsupported db type " + options.db.type + ", falling back to in-memory."

# Declare the path that ShareJS uses to Meteor
RoutePolicy.declare('/channel', 'network');

# Attach the sharejs REST and Socket.io interfaces as middleware to the meteor connect server
sharejs = Npm.require('share').server
sharejs.attach(WebApp.connectHandlers, options);

###
  ShareJS attaches the server API to a weird place. Oh well...
  https://github.com/share/ShareJS/blob/v0.6.2/src/server/index.coffee
###
ShareJS.model = WebApp.connectHandlers.model
