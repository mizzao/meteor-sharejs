/**
 * Created by dsichau on 27.04.16.
 */
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Blaze } from 'meteor/blaze'

import './loadBCSocket'
import 'share/webclient/share.uncompressed'
import './textarea'

export class ShareJSConnector {

    getOptions() {
        return {
            origin: '//' + window.location.host + '/channel'
        };
    };

    constructor(parentView) {
        const docIdVar = new ReactiveVar();

        parentView.onViewReady(function() {
            return this.autorun(function() {
                const data = Blaze.getData();
                return docIdVar.set(data.docid);
            });
        });

        parentView.onViewDestroyed(()=> {
            this.destroy()
        });

        this.isCreated = false;
        this.docIdVar = docIdVar;
        // Configure any callbacks if specified
        const params = Blaze.getData(parentView);
        this.configCallback = params.onRender;
        this.connectCallback = params.onConnect;
    }

    create() {
        if (this.isCreated) {
            throw new Error("Already created");
        }
        const connector = this;
        this.isCreated = true;
        this.view = this.createView();
        this.view.onViewReady(function() {
            connector.rendered(this.firstNode());
            return this.autorun(function() {
                var docId;
                docId = connector.docIdVar.get();
                connector.disconnect();
                if (docId) {
                    return connector.connect(docId);
                }
            });
        });
        return this.view;
    }

    rendered(element) {
        this.element = element;
    }

    connect(docId, element) {
        this.connectingId = docId;
        sharejs.open(docId, 'text', this.getOptions(), (error, doc) => {
            if (error) {
                console.log(error);
                return
            }
            // Don't attach if re-render happens too quickly and we' re trying to
            // connect to a different document now.
            if(this.connectingId !== doc.name) {
                doc.close();
            }
            else {
                this.attach(doc);
            }
        });
    }

    attach(doc) {
        this.doc = doc;
    }

    disconnect() {
        if(this.doc) {
            this.doc.close();
            this.doc = null;
        }
    }

    destroy() {
        if(this.isDestroyed) {
            throw new Error("Already destroyed")
        }
        this.disconnect();
        this.view = null;
        this.isDestroyed = true;
    }
}

class ShareJSTextConnector extends ShareJSConnector {

    createView() {
        return Blaze.With(Blaze.getData(),function() {
            return Template._sharejsText;
        })
    }

    rendered(element) {
        super.rendered(element);
        this.textarea = element;
        if (typeof this.configCallback === "function") {
            this.configCallback(this.textarea);
        }
    }

    connect() {
        this.textarea.disabled = true;
        super.connect(this.docIdVar.get());
    }

    attach(doc) {
        super.attach(doc);
        doc.attach_textarea(this.textarea);
        this.textarea.disabled = false;
        if (typeof this.connectCallback === "function") {
            this.connectCallback(this.textarea);
        }
    }

    disconnect() {
        const ref = this.textarea;
        if (ref != null) {
            if (typeof ref.detach_share === "function") {
                ref.detach_share();
            }
        }
        super.disconnect();
    }

    destroy() {
        super.destroy();
        // Meteor._debug "destroying textarea editor"
        this.textarea = null
    }
}

Template.registerHelper("sharejsText", new Template('sharejsText', function() {
    return new ShareJSTextConnector(this).create()
}));