Package.describe({
    summary: "server (& client library) to allow concurrent editing of any kind of content"
});

Npm.depends({share: "0.6.2"});

Package.on_use(function (api) {
    api.use('templating', 'client');
    api.use('coffeescript', 'server');

    // ShareJS script files
    api.add_files([
        '.npm/node_modules/share/node_modules/browserchannel/dist/bcsocket.js',
        '.npm/node_modules/share/webclient/share.js',
        '.npm/node_modules/share/webclient/textarea.js'
    ], 'client');

    // Our files
    api.add_files([
        'sharejs-templates.html',
        'sharejs-client.coffee'
    ], 'client');

    // Server files
    api.add_files([
        'sharejs-server.coffee'
    ], 'server');
});
