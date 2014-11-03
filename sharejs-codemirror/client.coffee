class ShareJSCMConnector extends ShareJSConnector
  createView: ->
    return Blaze.With(Blaze.getData, -> Template._sharejsCM)

  rendered: (element) ->
    super
    @cm = new CodeMirror(element)
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
    # from share/webclient/cm.js
    @doc?.detach_cm?()
    super

  destroy: ->
    super
    # Blaze will take it off the DOM,
    # Nothing needs to be done explicitly to clean up.
    @cm = null

UI.registerHelper "sharejsCM", new Template('sharejsCM', ->
  return new ShareJSCMConnector(this).create()
)
