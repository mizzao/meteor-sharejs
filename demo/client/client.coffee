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

Session.setDefault("editorType", "ace")

Template.docTitle.title = ->
  # Strange bug https://github.com/meteor/meteor/issues/1447
  Documents.findOne(@+"")?.title

Template.docTitle.editorType = (type) -> Session.equals("editorType", type)

Template.editor.docid = ->
  Session.get("document")

Template.editor.events =
  "keydown input[name=title]": (e) ->
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

  "change input[name=editor]": (e) ->
    Session.set("editorType", e.target.value)

Template.editor.textarea = -> Session.equals("editorType", "textarea")

Template.editor.config = ->
  (ace) ->
    # Set some reasonable options on the editor
    ace.setTheme('ace/theme/monokai')
    ace.setShowPrintMargin(false)
    ace.getSession().setUseWrapMode(true)
