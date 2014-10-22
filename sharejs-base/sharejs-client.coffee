class ShareJSConnector

  getOptions = ->
    origin: '//' + window.location.host + '/channel'
    authentication: Meteor.userId?() or null # accounts-base may not be in the app

  constructor: (parentView) ->
    # Create a ReactiveVar that tracks the docId that was passed in
    docIdVar = new Blaze.ReactiveVar

    parentView.onViewReady ->
      this.autorun ->
        data = Blaze.getData()
        docIdVar.set(data.docid)

    parentView.onViewDestroyed =>
      this.destroy()

    @isCreated = false
    @docIdVar = docIdVar

  create: ->
    throw new Error("Already created") if @isCreated
    connector = this
    @isCreated = true

    @view = @createView()
    @view.onViewReady ->
      connector.rendered( this.firstNode() )

      this.autorun ->
        # By grabbing docId here, we ensure that we only try to connect when
        # this is rendered.
        docId = connector.docIdVar.get()

        # Disconnect any existing connections
        connector.disconnect()
        connector.connect(docId) if docId

    return @view

  # Set up the context when rendered.
  rendered: (element) ->
    this.element = element

  # Connect to a document.
  connect: (docId, element) ->
    @connectingId = docId

    sharejs.open docId, 'text', getOptions(), (error, doc) =>
      if error
        Meteor._debug(error)
        return

      # Don't attach if re-render happens too quickly and we're trying to
      # connect to a different document now.
      unless @connectingId is doc.name
        doc.close() # Close immediately
      else
        @attach(doc)

  # Attach shareJS to the on-screen editor
  attach: (doc) ->
    @doc = doc

  # Disconnect from ShareJS. This should be idempotent.
  disconnect: ->
    # Close connection to the ShareJS doc
    if @doc?
      @doc.close()
      @doc = null

  # Destroy the connector and make sure everything's disconnected.
  destroy: ->
    throw new Error("Already destroyed") if @isDestroyed

    @disconnect()
    @view = null
    @isDestroyed = true

class ShareJSTextConnector extends ShareJSConnector
  createView: ->
    return Blaze.With(Blaze.getData, -> Template._sharejsText)

  rendered: (element) ->
    super
    @textarea = element

  connect: ->
    @textarea.disabled = true
    super

  attach: (doc) ->
    super
    doc.attach_textarea(@textarea)
    @textarea.disabled = false

  disconnect: ->
    @textarea?.detach_share?()
    super

  destroy: ->
    super
    # Meteor._debug "destroying textarea editor"
    @textarea = null

UI.registerHelper "sharejsText", new Template('sharejsText', ->
  return new ShareJSTextConnector(this).create()
)
