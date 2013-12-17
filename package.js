Package.describe({
    summary: "server (& client library) to allow concurrent editing of any kind of content"
});

Npm.depends({
    share: "0.6.2",
    mongodb: "1.3.17" // Current as of 0.6.5.1
    /*
        Uncomment these if you want to use redis.
        However, Mongo should be enough for most use cases.
        Fie on the Meteor developers who haven't implemented package options:
        https://github.com/meteor/meteor/issues/1292
    */
//    hiredis: '0.1.15', // See also https://github.com/stevemanuel/meteor-redis
//    redis: '0.8.4'
});

Package.on_use(function (api) {
    api.use('coffeescript');
    api.use(['handlebars', 'templating'], 'client');

    api.use('underscore', 'server');
    api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');
    api.use('build-fetcher');

    // ShareJS script files
    api.add_files([
        '.npm/package/node_modules/share/node_modules/browserchannel/dist/bcsocket.js',
        '.npm/package/node_modules/share/webclient/share.js'
    ], 'client');

    // Download the ace files from CDN for the client
    api.add_files('ace.fetch.json', 'client');

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
        'sharejs-server.coffee'
    ], 'server');

    // Export the ShareJS interface
    api.export('ShareJS', 'server');
});
