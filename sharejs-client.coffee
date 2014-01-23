Handlebars.registerHelper "sharejsText", (docid, options) ->
  id = options.hash.id || "sharejsTextEditor"
  return new Handlebars.SafeString Template._sharejsText(id: id, docid: docid)

aceConfigCallback = null

Handlebars.registerHelper "sharejsAce", (docid, options) ->
  id = options.hash.id || "sharejsAceEditor"
  aceConfigCallback = options.hash.callback
  return new Handlebars.SafeString Template._sharejsAce(id: id, docid: docid)

host = window.location.host

cleanup = ->
  # Detach event listeners from the textarea, unless you want crazy shit happenin'
  if @_elem
    @_elem.detach_share?()
    @_elem = null
  # Detach ace editor, if any
  if @_editor
    @_doc?.detach_ace?()
    @_editor = null
  # Close connection to the node server
  if @_doc
    @_doc.close()
    @_doc = null

Template._sharejsText.rendered = ->
  # close any previous docs if attached to rerender
  cleanup.call(@)

  @_elem = document.getElementById(@data.id);

  sharejs.open @data.docid, 'text', '//' + host + '/channel', (error, doc) =>
    if error
      @_elem.disabled = true
      console.log error
    else
      # Don't attach duplicate editors if re-render happens too fast
      return unless @_editor? and doc.name is @data.docid
      @_elem.disabled = false
      doc.attach_textarea(@_elem)
      @_doc = doc

Template._sharejsText.destroyed = ->
  cleanup.call(@)

Template._sharejsAce.rendered = ->
  # close any previous docs if attached to rerender
  cleanup.call(@)

  @_editor = ace.edit(@data.id)
  @_editor.setReadOnly(true); # Disable editing until share is connected

  sharejs.open @data.docid, 'text', '//' + host + '/channel', (error, doc) =>
    if error
      console.log error
    else
      # Don't attach duplicate editors if re-render happens too fast
      return unless @_editor? and doc.name is @data.docid

      doc.attach_ace(@_editor)
      @_editor.setReadOnly(false);
      @_doc = doc

  # Configure the editor as requested
  aceConfigCallback?(@_editor)

Template._sharejsAce.destroyed = ->
  cleanup.call(@)
