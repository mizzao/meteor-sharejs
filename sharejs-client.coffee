UI.registerHelper "sharejsAce", (a, b) ->
#  console.log a
#  console.log b
#  console.log this
#  console.log UI.emboxValue(@docid)
  Template._sharejsAce

host = window.location.host

getOptions = ->
  origin: '//' + host + '/channel'
  authentication: Meteor.userId?() or null # accounts-base may not be in the app

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

Template.sharejsText.rendered = ->
  # close any previous docs if attached to rerender
  cleanup.call(@)

  @_elem = document.getElementById(@data.id || "sharejsTextEditor")
  @_elem.disabled = true

  sharejs.open @data.docid, 'text', getOptions(), (error, doc) =>
    if error
      console.log error
    else
      # Don't attach duplicate editors if re-render happens too fast
      return unless @_elem? and doc.name is @data.docid

      doc.attach_textarea(@_elem)
      @_elem.disabled = false
      @_doc = doc

Template.sharejsText.destroyed = ->
  cleanup.call(@)

Template._sharejsAce.docid = ->
  console.log @
  @docid

Template._sharejsAce.rendered = ->
  # close any previous docs if attached to rerender
  cleanup.call(@)

  @_editor = ace.edit(@data.id || "sharejsAceEditor")
  @_editor.setReadOnly(true); # Disable editing until share is connected

  sharejs.open @data.docid, 'text', getOptions(), (error, doc) =>
    if error
      console.log error
    else
      # Don't attach duplicate editors if re-render happens too fast
      return unless @_editor? and doc.name is @data.docid

      doc.attach_ace(@_editor)
      @_editor.setReadOnly(false)
      @_doc = doc

  # Configure the editor as requested
  @data.callback?(@_editor)

Template.sharejsAce.destroyed = ->
  console.log "destroyed"
  cleanup.call(@)
