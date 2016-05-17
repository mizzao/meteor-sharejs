/**
 * Created by dsichau on 17.05.16.
 */

import {ShareJS} from 'meteor/sharejs';
var Docs, Ops, sleep;

Docs = new Meteor.Collection("docs");

Ops = new Meteor.Collection("ops");

Docs.remove({});

Ops.remove({});

sleep = Meteor.wrapAsync(function(time, cb) {
    return Meteor.setTimeout((function() {
        return cb(void 0);
    }), time);
});

Tinytest.add("server - model initialized properly", function(test) {
    return test.isTrue(ShareJS.model);
});

Tinytest.addAsync("server - initialize document with data", function(test, next) {
    var doc, docId;
    docId = Random.id();
    ShareJS.initializeDoc(docId, "foo");
    sleep(100);
    doc = Docs.findOne(docId);
    test.isTrue(doc);
    test.equal(doc != null ? doc._id : void 0, docId);
    test.isTrue(Ops.find().count() > 0);
    return ShareJS.model.getSnapshot(docId, function(err, res) {
        if (err != null) {
            test.fail();
        }
        test.equal(res.snapshot, "foo");
        return next();
    });
});