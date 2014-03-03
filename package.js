Package.describe({
    summary: "server (& client library) to allow concurrent editing of any kind of content"
});

Npm.depends({
    share: "0.6.2",
    /*
        Approximate version used in 0.7.0, but we just use MongoInternals.
        See also https://github.com/meteor/meteor/blob/devel/packages/mongo-livedata/package.js
        This is necessary for ShareJS to resolve the mongodb dependency and not complain.
    */
    mongodb: "1.3.19"
});

Package.on_use(function (api) {
    api.use(['coffeescript', 'underscore']);
    api.use(['handlebars', 'templating'], 'client');
    api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');

    // ShareJS script files
    api.add_files([
        '.npm/package/node_modules/share/node_modules/browserchannel/dist/bcsocket.js',
        '.npm/package/node_modules/share/webclient/share.js'
    ], 'client');

    // Ace editor for the client
    api.add_files('ace-builds/src-min/ace.js', 'client', { bare: true });

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
