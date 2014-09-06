Package.describe({
  name: "mizzao:sharejs",
  summary: "server (& client library) to allow concurrent editing of any kind of content",
  version: "0.6.0",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  share: "0.6.3",
  /*
      Mongo version used in 0.9 - we just use MongoInternals.
      Grabbed from https://github.com/meteor/meteor/blob/devel/packages/mongo-livedata/package.js
      Update this whenever we target a new Meteor version.
      This is necessary for ShareJS to require("mongodb") and not complain.
  */
  mongodb: "https://github.com/meteor/node-mongodb-native/tarball/cbd6220ee17c3178d20672b4a1df80f82f97d4c1"
});

// Ugly-ass function stolen from http://stackoverflow.com/a/20794116/586086
// TODO make this less ugly in future
function getFilesFromFolder(packageName, folder){
  // local imports
  var _ = Npm.require("underscore");
  var fs = Npm.require("fs");
  var path = Npm.require("path");
  // helper function, walks recursively inside nested folders and return absolute filenames
  function walk(folder){
    var filenames = [];
    // get relative filenames from folder
    var folderContent = fs.readdirSync(folder);
    // iterate over the folder content to handle nested folders
    _.each(folderContent, function(filename) {
      // build absolute filename
      var absoluteFilename = path.join(folder, filename);
      // get file stats
      var stat = fs.statSync(absoluteFilename);
      if(stat.isDirectory()){
        // directory case => add filenames fetched from recursive call
        filenames = filenames.concat(walk(absoluteFilename));
      }
      else{
        // file case => simply add it
        filenames.push(absoluteFilename);
      }
    });
    return filenames;
  }
  // save current working directory (something like "/home/user/projects/my-project")
  var cwd = process.cwd();
  // chdir to our package directory
  process.chdir(path.join("packages", packageName));
  // launch initial walk
  var result = walk(folder);
  // restore previous cwd
  process.chdir(cwd);
  return result;
}

Package.onUse(function (api) {
  api.versionsFrom("METEOR@0.9.1");

  var _ = Npm.require("underscore");

  api.use(['coffeescript', 'underscore']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');

  // ShareJS script files
  api.addFiles([
      '.npm/package/node_modules/share/node_modules/browserchannel/dist/bcsocket.js',
      '.npm/package/node_modules/share/webclient/share.js'
  ], 'client');

  // Ace editor for the client
  var aceJS = 'ace-builds/src/ace.js';
  api.addFiles(aceJS, 'client', { bare: true });

  // Add Ace files as assets that can be loaded by the client later
  var aceSettings = getFilesFromFolder("mizzao:sharejs", "ace-builds/src");
  api.addFiles(_.without(aceSettings, aceJS), 'client', {isAsset: true});

  // Add the ShareJS connectors
  // TODO: a really smart package would not push both of these to the client depending on use case
  api.addFiles('.npm/package/node_modules/share/webclient/ace.js', 'client');
  api.addFiles('.npm/package/node_modules/share/webclient/textarea.js', 'client');

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
