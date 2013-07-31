# Creates a (persistent) ShareJS server
# Roughly copied from https://github.com/share/ShareJS/wiki/Getting-started

# See docs for options. {type: 'redis'} to enable persistance.
# Using special options from https://github.com/share/ShareJS/blob/master/src/server/index.coffee
options =
  db: {type: 'none'}
  browserChannel: {cors: '*'}
  staticPath: null
  # rest: null

# Lets try and enable redis persistance if redis is installed...
try
  redis = Npm.require('redis')
  options.db =
    type: 'redis'
    client: redis.createClient() # (port, host, options): defaults to 6379, 127.0.0.1
  Meteor._debug "ShareJS: Redis persistence is enabled."
catch e
  Meteor._debug "ShareJS: Redis module not found. Documents will be in-memory only."

# Attach the sharejs REST and Socket.io interfaces as middleware to the meteor connect server
sharejs = Npm.require('share').server
sharejs.attach(WebApp.connectHandlers, options);
