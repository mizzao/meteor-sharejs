Package.describe({
  name: "mizzao:sharejs",
  summary: "server (& client library) to allow concurrent editing of any kind of content",
  version: "0.7.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  share: "0.6.3",
  /*
      Mongo version used in 0.9 - we just use MongoInternals.
      Grabbed from https://github.com/meteor/meteor/blob/devel/packages/mongo/package.js
      Update this whenever we target a new Meteor version.
      This is necessary for ShareJS to require("mongodb") and not complain.
  */
  mongodb: "https://github.com/meteor/node-mongodb-native/tarball/cbd6220ee17c3178d20672b4a1df80f82f97d4c1"
});

Package.onUse(function (api) {
  api.versionsFrom("1.0");

  api.use(['coffeescript', 'underscore']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');

  // ShareJS script files
  api.addFiles([
      '.npm/package/node_modules/share/node_modules/browserchannel/dist/bcsocket.js',
      '.npm/package/node_modules/share/webclient/share.js'
  ], 'client');

  // Add the ShareJS connectors
  api.addFiles('.npm/package/node_modules/share/webclient/textarea.js', 'client');

  // TODO these cannot be easily added by the subpackages, unfortunately
  // We add them as an asset so that they can be loaded later, asynchronously
  api.addFiles('.npm/package/node_modules/share/webclient/ace.js', 'client', { isAsset: true });
  api.addFiles('.npm/package/node_modules/share/webclient/cm.js', 'client', { isAsset: true });

  // Our files
  api.addFiles([
      'sharejs-templates.html',
      'sharejs-client.coffee'
  ], 'client');

  // Server files
  api.addFiles([
      'sharejs-meteor-auth.coffee',
      'sharejs-server.coffee'
  ], 'server');

  // Export the ShareJS interface
  api.export('ShareJS', 'server');

  // For subpackages to extend client functionality
  api.export('ShareJSConnector', 'client');
});

Package.onTest(function (api) {
  api.use([
    'coffeescript',
    'tinytest',
    'test-helpers'
  ]);

  api.use("mizzao:sharejs");

  api.addFiles('tests/server_tests.coffee', 'server');
});
