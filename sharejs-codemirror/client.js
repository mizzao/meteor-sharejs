/**
 * Created by dsichau on 29.04.16.
 */
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze' 
import { ShareJSConnector } from 'meteor/mizzao:sharejs'

import CodeMirror from 'codemirror';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/display/placeholder';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/hint/show-hint.css';

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