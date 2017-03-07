Package.describe({
  name: "mizzao:sharejs",
  summary: "server (& client library) to allow concurrent editing of any kind of content",
  version: "0.9.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  // Fork of 0.6.3 that doesn't require("mongodb"):
  // https://github.com/meteor/meteor/issues/532#issuecomment-82635979
  // Includes "Failed to parse" bugfix
  share: "https://github.com/qeek/sharejs-tmp-fork/tarball/94c059bd4da24de8e6e90fb83484dd9c7b0efd59",
  browserchannel: '1.2.0'
});

Package.onUse(function (api) {
  api.versionsFrom("1.3");

  api.use(['underscore', 'ecmascript', 'modules']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');


  api.mainModule('sharejs-client.js', 'client');
  api.mainModule('sharejs-server.js', 'server');
  // Our files
  api.addFiles([
      'sharejs-templates.html'
  ], 'client');

});

Package.onTest(function (api) {
  api.use([
    'random',
    'ecmascript',
    'modules',
    'tinytest',
    'test-helpers'
  ]);

  api.use("mizzao:sharejs");

  api.addFiles('tests/server_test.js', 'server');
});
