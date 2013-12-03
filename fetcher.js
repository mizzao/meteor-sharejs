var fs = Npm.require('fs');

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/*
    Create a handler for fetch.json files
    This is convenient because it will only ever get the file once
    unless the .fetch.json target changes

    Could be pulled out into a separate build-fetcher package if warranted.
 */
var handler = function (compileStep) {
    var options = JSON.parse(compileStep.read().toString('utf8'));

    for( var file in options ) {
        console.log("Downloading " + options[file] + " to " + file);
        var output = HTTP.get(options[file]).content;

        if( endsWith(file, ".js") ) {
            compileStep.addJavaScript({
                path: file,
                data: output,
                sourcePath: file,
                bare: true
            });
        }
        else {
            compileStep.addAsset({
                path: file,
                data: new Buffer(output) // XXX This is dumb, I think
            });
        }
    };
};

Plugin.registerSourceHandler("fetch.json", handler);
