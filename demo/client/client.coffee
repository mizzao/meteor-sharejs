

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
  @_id is Session.get("document")

Template.docItem.events =
  "click a": (e) ->
    e.preventDefault()
    Session.set("document", @_id)

Template.editor.title = ->
  id = Session.get("document")
  Documents.findOne(id)?.title

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

  "click button": ->
    id = Session.get("document")
    Documents.remove(id)
    Session.set("document", null)
