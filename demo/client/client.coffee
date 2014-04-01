Handlebars.registerHelper "withif", (obj, options) ->
  if obj then options.fn(obj) else options.inverse(this)

Template.docList.documents = ->
  Documents.find()

Template.docList.events =
  "click button": ->
    Documents.insert
      title: "untitled"
    , (err, id) ->
      return unless id
      Session.set("document", id)

Template.docItem.current = ->
  Session.equals("document", @_id)

Template.docItem.events =
  "click a": (e) ->
    e.preventDefault()
    Session.set("document", @_id)

Template.docTitle.title = ->
  # Strange bug https://github.com/meteor/meteor/issues/1447
  Documents.findOne(@substring 0)?.title

Template.editor.docid = ->
  Session.get("document")

Template.editor.events =
  "keydown input": (e) ->
    return unless e.keyCode == 13
    e.preventDefault()

    $(e.target).blur()
    id = Session.get("document")
    Documents.update id,
      title: e.target.value

  "click button": (e) ->
    e.preventDefault()
    id = Session.get("document")
    Session.set("document", null)
    Meteor.call "deleteDocument", id

Template.editor.config = ->
  (ace) ->
    # Set some reasonable options on the editor
    ace.setShowPrintMargin(false)
    ace.getSession().setUseWrapMode(true)
