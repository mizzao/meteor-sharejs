Package.describe({
  name: "mizzao:sharejs-ace",
  summary: "ShareJS with the Ace Editor",
  version: "1.4.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});


Npm.depends({
  "ace-builds": "1.2.2"
});

Package.onUse(function (api) {
  api.versionsFrom("1.3");

  api.use(['ecmascript', 'modules', 'templating']);

  api.use("mizzao:sharejs@0.9.0");
  api.imply("mizzao:sharejs");
  
  api.mainModule('client.js', 'client');
  api.addFiles([
    'templates.html'
  ], 'client');
});
