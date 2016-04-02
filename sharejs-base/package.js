Package.describe({
  name: "mizzao:sharejs",
  summary: "server (& client library) to allow concurrent editing of any kind of content",
  version: "0.8.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  // Fork of 0.6.3 that doesn't require("mongodb"):
  // https://github.com/meteor/meteor/issues/532#issuecomment-82635979
  share: "https://github.com/mizzao/ShareJS/tarball/05b625ea1e7f7f27bd13ba7ed05102b38dd175e5"
});

Package.onUse(function (api) {
  api.versionsFrom("1.2.0.1");

  api.use(['coffeescript', 'underscore']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');

  // ShareJS script files
  api.addFiles([
      '.npm/package/node_modules/share/node_modules/browserchannel/dist/bcsocket-uncompressed.js',
      '.npm/package/node_modules/share/webclient/share.uncompressed.js'
  ], 'client');

  // Add the ShareJS connectors
  api.addFiles('.npm/package/node_modules/share/webclient/textarea.js', 'client');

  // TODO these cannot be easily added by the subpackages, unfortunately
  // We add them as an asset so that they can be loaded later, asynchronously
  api.addAssets('.npm/package/node_modules/share/webclient/cm.js', 'client');

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
    'random',
    'coffeescript',
    'tinytest',
    'test-helpers'
  ]);

  api.use("mizzao:sharejs");

  api.addFiles('tests/server_tests.coffee', 'server');
});
