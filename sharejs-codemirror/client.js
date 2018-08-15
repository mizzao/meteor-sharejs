/**
 * Created by dsichau on 29.04.16.
 */
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze' 
import { ShareJSConnector } from 'meteor/mizzao:sharejs'

try {
  CodeMirror = require('codemirror');
  import 'codemirror/lib/codemirror.css';
} catch (e) {
  if (e.toString().match("Cannot find module")) {
    console.error("Could not load NPM module `codemirror`, which is a peer " +
      "dependency. You need to `meteor npm install --save codemirror`.");
    return;
  } else {
    throw e;
  }
}

import './cm'

class ShareJSCMConnector extends ShareJSConnector {
    createView() {
        return Blaze.With(Blaze.getData(), function(){
            return Template._sharejsCM
        });
    }
    rendered(element){
        super.rendered(element);
        this.cm = new CodeMirror(element, {readOnly: true, value: "loading..."});
        if (typeof this.configCallback === "function") {
            this.configCallback(this.cm);
        }
    }
    connect() {
        super.connect(this.docIdVar.get());
    }
    attach(doc){
        super.attach(doc);
        doc.attach_cm(this.cm);
        this.cm.setOption("readOnly", false);
        if (typeof this.connectCallback === "function") {
            this.connectCallback(this.cm);
        }
    }
    disconnect() {
        const ref = this.doc;
        if (ref != null) {
            if (typeof ref.detach_cm === "function") {
                ref.detach_cm();
            }
        }
        super.disconnect();
    }
    destroy() {
        super.destroy();
        this.cm = null;
    }
}
Template.registerHelper("sharejsCM", new Template('sharejsCM',function(){
    return new ShareJSCMConnector(this).create();
}));
