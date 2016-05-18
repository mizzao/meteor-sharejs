/**
 * Created by dsichau on 27.04.16.
 */

import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import { ShareJSConnector } from 'meteor/mizzao:sharejs'

require('ace-builds/src/ace');
ace.require('ace/config').set('basePath', '/packages/mizzao_sharejs-ace/.npm/package/node_modules/ace-builds/src/');
UndoManager = ace.require('ace/undomanager').UndoManager;
import './ace'

class ShareJSAceConnector extends ShareJSConnector {
    
    createView() {
        return Blaze.With(Blaze.getData(), function(){
            return Template._sharejsAce;
        });
    }
    rendered(element){
        super.rendered(element);
        this.ace = ace.edit(element);
        this.ace.getSession().setValue("loading...");
        this.ace.$blockScrolling = Infinity;
        if (typeof this.configCallback === "function") {
            this.configCallback(this.ace);
        }
    } 
    connect() {
        this.ace.setReadOnly(true);
        super.connect(this.docIdVar.get());
    }
    attach(doc){
        super.attach(doc);
        doc.attach_ace(this.ace);
        // Reset undo stack, so that we can't undo to an empty document
        // XXX It seems that we should be able to use getUndoManager().reset()
        // here, but that doesn't seem to work:
        // http://japhr.blogspot.com/2012/10/ace-undomanager-and-setvalue.html
        this.ace.getSession().setUndoManager(new UndoManager());
        this.ace.setReadOnly(false);
        if (typeof this.connectCallback === "function") {
            this.connectCallback(this.ace);
        }
    }
    disconnect() {
        const ref = this.doc;
        if (ref != null) {
            if (typeof ref.detach_ace === "function") {
                ref.detach_ace();
            }
        }
        super.disconnect();
    }
    destroy() {
        super.destroy();
        // Meteor._debug "destroying textarea editor"
        if(this.ace) {
            this.ace.destroy();
        }
        this.ace = null;
    }
}

Template.registerHelper("sharejsAce", new Template('sharejsAce',function(){ 
  return new ShareJSAceConnector(this).create();
}));