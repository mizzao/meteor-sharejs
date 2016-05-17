Package.describe({
  name: "mizzao:sharejs",
  summary: "server (& client library) to allow concurrent editing of any kind of content",
  version: "0.9.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  // Fork of 0.6.3 that doesn't require("mongodb"):
  // https://github.com/meteor/meteor/issues/532#issuecomment-82635979
  share: "https://github.com/mizzao/ShareJS/tarball/05b625ea1e7f7f27bd13ba7ed05102b38dd175e5"
});

Package.onUse(function (api) {
  api.versionsFrom("1.3");

  api.use(['underscore', 'ecmascript', 'modules']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['coffeescript', 'mongo-livedata', 'routepolicy', 'webapp'], 'server');


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
    'coffeescript',
    'tinytest',
    'test-helpers'
  ]);

  api.use("mizzao:sharejs");

  api.addFiles('tests/server_tests.coffee', 'server');
});
