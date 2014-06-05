Package.describe({
    summary: "server (& client library) to allow concurrent editing of any kind of content"
});

Npm.depends({
  share: "0.6.3",
  /*
      Mongo version used in 0.8.0, but we just use MongoInternals.
      Grabbed from https://github.com/meteor/meteor/blob/devel/packages/mongo-livedata/package.js
      Update this whenever we target a new Meteor version.
      This is necessary for ShareJS to resolve the mongodb dependency and not complain.
  */
  mongodb: "1.4.1"
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

Package.on_use(function (api) {
  var _ = Npm.require("underscore");

  api.use(['coffeescript', 'underscore']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');

  // ShareJS script files
  api.add_files([
      '.npm/package/node_modules/share/node_modules/browserchannel/dist/bcsocket.js',
      '.npm/package/node_modules/share/webclient/share.js'
  ], 'client');

  // Ace editor for the client
  var aceJS = 'ace-builds/src/ace.js';
  api.add_files(aceJS, 'client', { bare: true });

  // Add Ace files as assets that can be loaded by the client later
  var aceSettings = getFilesFromFolder("sharejs", "ace-builds/src");
  api.add_files(_.without(aceSettings, aceJS), 'client', {isAsset: true});

  // Add the ShareJS connectors
  // TODO: a really smart package would not push both of these to the client depending on use case
  api.add_files('.npm/package/node_modules/share/webclient/ace.js', 'client');
  api.add_files('.npm/package/node_modules/share/webclient/textarea.js', 'client');

  // Our files
  api.add_files([
      'sharejs-templates.html',
      'sharejs-client.coffee'
  ], 'client');

  // Server files
  api.add_files([
      'sharejs-meteor-auth.coffee',
      'sharejs-server.coffee'
  ], 'server');

  // Export the ShareJS interface
  api.export('ShareJS', 'server');
});

Package.on_test(function (api) {
  api.use([
    'coffeescript',
    'tinytest',
    'test-helpers'
  ]);

  api.use("sharejs");

  api.add_files('tests/server_tests.coffee', 'server');
});
