# Set asset path in Ace config
require('ace/config').set('basePath', '/packages/sharejs/ace-builds/src')

# Hack the shit out of the Blaze Component API
# until https://github.com/meteor/meteor/issues/2010 is resolved
UI.registerHelper "sharejsAce", ->
  UI.Component.extend
    kind: "ShareJSAce",
    render: -> Template._sharejsAce

UI.registerHelper "sharejsText", ->
  UI.Component.extend
    kind: "ShareJSText",
    render: -> Template._sharejsText

host = window.location.host

getOptions = ->
  origin: '//' + host + '/channel'
  authentication: Meteor.userId?() or null # accounts-base may not be in the app

cleanup = ->
  # console.log "cleaning up"
  # Detach event listeners from the textarea, unless you want crazy shit happenin'
  if @_elem?
    @_elem.detach_share?()
    @_elem = null
  # Detach ace editor, if any
  if @_editor?
    @_doc?.detach_ace?()
    @_editor = null
  # Close connection to the node server
  if @_doc?
    @_doc.close()
    @_doc = null

Template._sharejsText.rendered = ->
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

Template._sharejsText.destroyed = cleanup

Template._sharejsAce.rendered = ->
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

Template._sharejsAce.destroyed = cleanup
