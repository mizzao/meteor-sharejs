class ShareJSCMConnector extends ShareJSConnector
  constructor: (parentView) ->
    super
    params = Blaze.getData(parentView)
    @configCallback = params.onRender || params.callback # back-compat
    @connectCallback = params.onConnect

  createView: ->
    return Blaze.With(Blaze.getData, -> Template._sharejsCM)

  rendered: (element) ->
    super
    @cm = CodeMirror.fromTextArea(element)
    @configCallback?(@cm)

  connect: ->
    @cm.readOnly = true
    super

  attach: (doc) ->
    super
    doc.attach_cm(@cm)
    @cm.readOnly = false
    @connectCallback?(@cm)

  disconnect: ->
    @cm?.detach_share?()
    super

  destroy: ->
    super
    # Meteor._debug "destroying cm editor"
    @cm?.toTextArea()
    @cm = null

UI.registerHelper "sharejsCM", new Template('sharejsCM', ->
  return new ShareJSCMConnector(this).create()
)
