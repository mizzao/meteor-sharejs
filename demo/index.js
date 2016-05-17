/**
 * 
 * Created by dsichau on 11.05.16.
 */

import {ShareJS} from 'meteor/mizzao:sharejs';

this.Documents = new Meteor.Collection("documents");

Meteor.methods({
    deleteDocument(id){
        Documents.remove(id);
        if(Meteor.isServer) {
            ShareJS.model.delete(id);
        }
    }
});
