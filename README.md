meteor-sharejs
==============


Meteor smart package for transparently adding [ShareJS](https://github.com/share/ShareJS) editors to an app. Includes [CodeMirror](http://codemirror.net/) and the [Ace editor](http://ace.c9.io/).

This package is only tested for meteor 1.3 or later

## Install

For vanilla ShareJS with text only:

```
$ meteor add mizzao:sharejs
```

For ShareJS with the Ace editor

```
$ meteor add  mizzao:sharejs-ace
```

For ShareJS with the CodeMirror editor:

```
$ meteor add mizzao:sharejs-codemirror
```

## Usage

No configuration necessary for anonymous document editing. If you want to integrate with Meteor accounts, see below.

Use this helper on the client to get a `textarea` with the specified `docid` (as an argument) and with a DOM id of "editor", for example:

```
{{> sharejsText docid=docid id="editor"}}
```

Use this helper to get an Ace editor. Make sure you specify a size (via CSS) on the #editor div or you won't see anything.
```
{{> sharejsAce docid=docid id="editor"}}
```

Use this helper to get a CodeMirror editor. 
```
{{> sharejsCM docid=docid id="editor"}}
```

The templates will clean themselves up when re-rendered (i.e., you have several documents and docid changes.)

## Client Configuration

For the Ace and CodeMirror editors, you can define `onRender` and `onConnect` callbacks in the options hash and use it to configure the editor. `onRender` is called when the editor is initially rendered, and `onConnect` is called after each successful connection to a document.

```
{{> sharejsAce docid=document onRender=config onConnect=setMode id="editor"}}
```

All [standard Ace themes and extensions](https://github.com/ajaxorg/ace-builds/tree/master/src) are supported. Note that the helper has to return a function inside of a function:

```
Template.foo.config = function () {
  return function(editor) {
    # Set some reasonable options on the editor
    editor.setTheme('ace/theme/monokai')
    editor.getSession().setMode('ace/mode/javascript')
    editor.setShowPrintMargin(false)
    editor.getSession().setUseWrapMode(true)
  }
};
```

## Server Configuration

See this [example config file](settings-example.json) for the various settings that you can use.

If you are running on mobile via Meteor's Cordova, you'll also need to specify a `cors` rule to allow the mobile device's `localhost` server to make a cross-origin request, such as the following:

```json
{
  "sharejs": {
    "options": {
      "browserChannel": {
        "cors": "*"
      },
      ...
    }
  }
}
```

### Persistence

By default, the documents and edit operations will be persisted in Meteor's Mongo database. Mongo is the recommended usage as you don't need a separate database and user integration is supported. `"opsCollectionPerDoc": false` can be useful to set if you don't want a separate ops collection for each document.

You can also use `db.type` of `none` to have all documents and operations in memory.

### Meteor User-Accounts Integration

The Authorization was removed in version 0.9.0, because the current implementation did not added any security as `Meteor.userId` is not a secret token.

## Advanced

You can access the [ShareJS Server API](https://github.com/share/ShareJS/wiki/Server-api) via `import { ShareJS } from 'meteor/mizzao:sharejs'`. For example, you may want to delete documents ops when the document is deleted in your app. See the demo for an example.

## Notes

- When using the default mongo driver, you must not use collections called `docs` or `ops`. [These are used by ShareJS](https://github.com/share/ShareJS/blob/v0.6.2/src/server/db/mongo.coffee).
- It's best to create a `Meteor.Collection` for your documents which generates good unique ids to connect to ShareJS with. Use these to render the templates above. See the [demo](demo) for examples.

Please submit pull requests for better features and cooperation!

## Contributors

* Andrew Mao (https://github.com/mizzao/)
* Karan Batra-Daitch (https://github.com/kbdaitch)
* CJ Carr (https://github.com/cortexelus)
* David Sichau (https://github.com/DavidSichau)
