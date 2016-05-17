Package.describe({
  name: "mizzao:sharejs-codemirror",
  summary: "ShareJS with the CodeMirror Editor",
  version: "5.14.2",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  codemirror: "5.14.2"
});

Package.onUse(function (api) {
  api.versionsFrom("1.3.2");

  api.use(['ecmascript', 'modules', 'templating']);

  api.use("mizzao:sharejs@0.9.0");
  api.imply("mizzao:sharejs");

  api.mainModule('client.js', 'client');
  api.addFiles([
    'templates.html'
  ], 'client');
});
