

Template.docList.helpers({
  documents: function() {
    return Documents.find();
  }
});

Template.docList.events = {
  "click button": function() {
    return Documents.insert({
      title: "untitled"
    }, function(err, id) {
      if (!id) {
        return;
      }
      return Session.set("document", id);
    });
  }
};

Template.docItem.helpers({
  current: function() {
    return Session.equals("document", this._id);
  }
});

Template.docItem.events = {
  "click a": function(e) {
    e.preventDefault();
    return Session.set("document", this._id);
  }
};

Session.setDefault("editorType", "ace");

Template.docTitle.helpers({
  title: function() {
    var ref;
    return (ref = Documents.findOne(this + "")) != null ? ref.title : void 0;
  },
  editorType: function(type) {
    return Session.equals("editorType", type);
  }
});

Template.editor.helpers({
  docid: function() {
    return Session.get("document");
  }
});

Template.editor.events = {
  "keydown input[name=title]": function(e) {
    var id;
    if (e.keyCode !== 13) {
      return;
    }
    e.preventDefault();
    $(e.target).blur();
    id = Session.get("document");
    return Documents.update(id, {
      title: e.target.value
    });
  },
  "click button": function(e) {
    var id;
    e.preventDefault();
    id = Session.get("document");
    Session.set("document", null);
    return Meteor.call("deleteDocument", id);
  },
  "change input[name=editor]": function(e) {
    return Session.set("editorType", e.target.value);
  }
};

Template.editor.helpers({
  textarea: function() {
    return Session.equals("editorType", "textarea");
  },
  cm: function() {
    return Session.equals("editorType", "cm");
  },
  ace: function() {
    return Session.equals("editorType", "ace");
  },
  configAce: function() {
    return function(ace) {
      ace.setTheme('ace/theme/monokai');
      ace.setShowPrintMargin(false);
      return ace.getSession().setUseWrapMode(true);
    };
  },
  configCM: function() {
    return function(cm) {
      cm.setOption("theme", "default");
      cm.setOption("lineNumbers", true);
      cm.setOption("lineWrapping", true);
      cm.setOption("smartIndent", true);
      return cm.setOption("indentWithTabs", true);
    };
  }
});


