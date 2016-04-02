Package.describe({
  name: "mizzao:sharejs-ace",
  summary: "ShareJS with the Ace Editor",
  version: "1.1.9",
  git: "https://github.com/mizzao/meteor-sharejs.git"
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

  var isRunningFromApp = fs.existsSync(path.resolve("packages"));
  var packagePath = isRunningFromApp ? path.resolve("packages", packageName) : "";

  packagePath = path.resolve(packagePath);
  // chdir to our package directory
  process.chdir(path.join(packagePath));
  // launch initial walk
  var result = walk(folder);
  // restore previous cwd
  process.chdir(cwd);
  return result;
}

Package.onUse(function (api) {
  api.versionsFrom("1.2.0.1");

  api.use(['coffeescript', 'templating']);

  api.use("mizzao:sharejs@0.7.5");
  api.imply("mizzao:sharejs");

  var _ = Npm.require("underscore");

  // Ace editor for the client
  var aceJS = 'ace-builds/src/ace.js';
  api.addFiles(aceJS, 'client', { bare: true });

  // Add Ace files as assets that can be loaded by the client later

  var aceSettings = getFilesFromFolder("mizzao:sharejs-ace", "ace-builds/src");
  api.addAssets(_.without(aceSettings, aceJS), 'client');

  api.addFiles([
    'templates.html',
    'client.coffee'
  ], 'client');
});
