# Set asset path in Ace config
require('ace/config').set('basePath', '/packages/mizzao_sharejs-ace/ace-builds/src')

class ShareJSAceConnector extends ShareJSConnector
  createView: ->
    return Blaze.With(Blaze.getData, -> Template._sharejsAce)

  rendered: (element) ->
    super
    @ace = ace.edit(element)
    # Configure the editor if specified
    @configCallback?(@ace)

  connect: ->
    @ace.setReadOnly(true); # Disable editing until share is connected
    super

  attach: (doc) ->
    super
    doc.attach_ace(@ace)
    @ace.setReadOnly(false)
    @connectCallback?(@ace)
    #Reset the undo manager, such that ctrl-z does not lead to an empty document
    UndoManager = require("ace/undomanager").UndoManager;
    @ace.getSession().setUndoManager(new UndoManager());

  disconnect: ->
    # Detach ace editor, if any
    @doc?.detach_ace?()
    super

  destroy: ->
    super
    # Meteor._debug "destroying Ace editor"
    @ace?.destroy()
    @ace = null

UI.registerHelper "sharejsAce", new Template('sharejsAce', ->
  return new ShareJSAceConnector(this).create()
)
