Handlebars.registerHelper "withif", (obj, options) ->
  console.log obj
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
  @_id is Session.get("document")

Template.docItem.events =
  "click a": (e) ->
    e.preventDefault()
    Session.set("document", @_id)

Template.docTitle.title = ->
  Documents.findOne(@substring(0))?.title

Template.editor.docid = ->
  id = Session.get("document")
  # Can't stay in a document if someone deletes it!
  return if Documents.findOne(id) then id else `undefined`

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

Template.editor.config = ->
  (ace) ->
    # Set some reasonable options on the editor
    ace.setShowPrintMargin(false)
    ace.getSession().setUseWrapMode(true)
