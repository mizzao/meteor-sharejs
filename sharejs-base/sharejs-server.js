// Creates a (persistent) ShareJS server
// Based on https://github.com/share/ShareJS/wiki/Getting-started

import { Meteor } from 'meteor/meteor';

const Future = Npm.require('fibers/future');

export const ShareJS = ShareJS || {};
// See docs for options. Uses mongo by default to enable persistence.

// Using special options from https://github.com/share/ShareJS/blob/master/src/server/index.coffee
const options = _.extend({
    staticPath: null,
    db: {
        type: 'none', // Default option is none as it throws errors in meteor 1.4 due to issues in upstream sharejs
        opsCollectionPerDoc: false // A doc/op indexed collection keeps the namespace cleaner in a Meteor app.
    }
}, (ref = Meteor.settings.sharejs) != null ? ref.options : void 0);

switch (options.db.type) {
    case 'mongo':

        /*
         ShareJS 0.6.3 mongo driver:
         https://github.com/share/ShareJS/blob/v0.6.3/src/server/db/mongo.coffee
         It will create its own indices on the 'ops' collection.
         */
        options.db.client = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
        /* Disable the open command due to the bug introduced in ShareJS 0.6.3
         where an open database connection is not accepted
         https://github.com/share/ShareJS/commit/f98a4adeca396df3ec6b1d838b965ff158f452a3

         Meteor has already opened the database connection, so this should work,
         but watch monkey-patch carefully with changes in how
         https://github.com/meteor/meteor/blob/devel/packages/mongo-livedata/mongo_driver.js
         uses the API at
         http://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
         */
        options.db.client.open = function() {};
        break;
    default:
        Meteor._debug("ShareJS: using unsupported db type " + options.db.type + ", falling back to in-memory.");
}
//Declare the path that ShareJS uses to Meteor
RoutePolicy.declare('/channel/', 'network');
// Attach the sharejs REST and bcsocket interfaces as middleware to the meteor connect server
Npm.require('share').server.attach(WebApp.connectHandlers, options);


/*
 ShareJS attaches the server API to a weird place. Oh well...
 https://github.com/share/ShareJS/blob/v0.6.2/src/server/index.coffee
 */

ShareJS.model = WebApp.connectHandlers.model;
// A convenience function for creating a document on the server.
ShareJS.initializeDoc = function(docName, content) {
    return ShareJS.model.create(docName, 'text', {}, function(err) {
        var opData;
        if (err) {
            console.log(err);
            return;
        }
        //One op; insert all the content at position 0
        //https://github.com/share/ShareJS/wiki/Server-api
        opData = {
            op: [{ i: content, p: 0 }],
            v: 0,
            meta: {}
        };
        return ShareJS.model.applyOp(docName, opData, function(err, res) {
            if (err) {
                return console.log(err);
            }
        });
    });
};

