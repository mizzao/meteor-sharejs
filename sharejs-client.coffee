Handlebars.registerHelper "sharejsText", (docid, options) ->
  id = options.hash.id || "sharejsTextEditor"
  return new Handlebars.SafeString Template._sharejsText(id: id, docid: docid)

Handlebars.registerHelper "sharejsAce", (docid, options) ->
  id = options.hash.id || "sharejsAceEditor"
  return new Handlebars.SafeString Template._sharejsAce(id: id, docid: docid)

host = window.location.hostname
port = Meteor.settings.public?.sharejs?.port || 3003

cleanup = ->
  # Detach event listeners from the textarea, unless you want crazy shit happenin'
  if @_elem
    @_elem.detach_share()
    @_elem = null
  # Detach ace editor, if any
  if @_editor
    @_doc.detach_ace()
    @_editor = null
  # Close connection to the node server
  if @_doc
    @_doc.close()
    @_doc = null

Template._sharejsText.rendered = ->
  # close any previous docs if attached to rerender
  cleanup.call(@)

  @_elem = document.getElementById(@data.id);

  sharejs.open @data.docid, 'text', 'http://' + host + ':' + port + '/channel', (error, doc) =>
    if error
      @_elem.disabled = true
      console.log error
    else
      @_elem.disabled = false
      doc.attach_textarea(@_elem)
    @_doc = doc

Template._sharejsText.destroyed = ->
  cleanup.call(@)

Template._sharejsAce.rendered = ->
  # close any previous docs if attached to rerender
  cleanup.call(@)

  @_editor = ace.edit(@data.id)

  sharejs.open @data.docid, 'text', 'http://' + host + ':' + port + '/channel', (error, doc) =>
    if error
      console.log error
    else
      doc.attach_ace(@_editor)
    @_doc = doc

Template._sharejsAce.destroyed = ->
  cleanup.call(@)
