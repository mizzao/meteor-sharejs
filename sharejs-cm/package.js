Package.describe({
  name: "mizzao:sharejs-cm",
  summary: "ShareJS with the CodeMirror Editor",
  version: "4.7.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Package.onUse(function (api) {
  api.versionsFrom("0.9.4");

  api.use(['coffeescript', 'templating']);

  api.use("mizzao:sharejs@0.7.0");
  api.imply("mizzao:sharejs");

  // CM editor for the client
  api.addFiles([
    'codemirror/lib/codemirror.js',
    'codemirror/lib/codemirror.css',
    'codemirror/theme/monokai.css',
    'codemirror/addon/fold/foldgutter.css',
    'codemirror/addon/fold/foldcode.js',
    'codemirror/addon/fold/foldgutter.js',
    'codemirror/addon/fold/indent-fold.js',
    'codemirror/addon/hint/show-hint.js',
    'codemirror/addon/display/placeholder.js',
    'codemirror/addon/hint/show-hint.css'
    /* include any extra codemirror ADDONS or MODES or THEMES here !!!! */
  ], 'client', { bare: true });

  api.addFiles([
    'templates.html',
    'client.coffee'
  ], 'client');
});
