# Hook into the ShareJS collection with Meteor
Docs = new Meteor.Collection("docs")
# Unfortunately, we can't query from this collection because ShareJS uses
# compound ids that aren't supported in Meteor. We can remove from it, however.
Ops = new Meteor.Collection("ops")

Docs.remove {}
Ops.remove {}

sleep = Meteor._wrapAsync((time, cb) -> Meteor.setTimeout (-> cb undefined), time)

Tinytest.add "server - model initialized properly", (test) ->
  test.isTrue(ShareJS.model)

# This test has the added benefit of ensuring that the stack is initialized properly on the server.
Tinytest.addAsync "server - initialize document with data", (test, next) ->
  docId = Random.id()
  ShareJS.initializeDoc(docId, "foo")

  sleep(100)

  doc = Docs.findOne(docId)
  test.isTrue(doc)
  test.equal doc?._id, docId

  test.isTrue Ops.find().count() > 0

  ShareJS.model.getSnapshot docId, (err, res) ->
    test.fail() if err?
    test.equal res.snapshot, "foo"
    next()
