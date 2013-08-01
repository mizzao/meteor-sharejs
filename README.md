meteor-sharejs
==============

Meteor smart package for transparently adding ShareJS editors to an app

Demo app: http://documents.meteor.com (source: https://github.com/mizzao/meteor-documents-demo)

## Install

```
$ mrt add sharejs
```

## Usage

Currently, no configuration necessary.

Use this helper on the client to get a `textarea` with the specified `docid` (as an argument) and with a DOM id of "editor", for example:

```
{{sharejsText docid id="editor"}}
```

Use this helper to get an Ace editor. Make sure you specify a size (via CSS) on the #editor div or you won't see anything.
```
{{sharejsAce docid id="editor"}}
```

The templates will clean themselves up when re-rendered (i.e., you have several documents and docid changes.)

### Configuration

For the Ace editor, define a custom callback in the options hash and pass it in to configure the editor after it is rendered.
```
{{sharejsAce document callback=config id="editor"}}
```

 Note that the helper has to return a function inside of a function:
```
Template.foo.config = ->
  (editor) ->
    # Set some reasonable options on the editor
    editor.setShowPrintMargin(false)
    editor.getSession().setUseWrapMode(true)
```

## Persistence

To use Redis to persist the documents (so that you don't use them every time Meteor restarts), fire up a Redis instance and put the following in your settings file. Make sure to run meteor with the settings: `meteor --settings yoursettings.json`.

```js
"sharejs": {
    "options": {
        "db": {
            "type": "redis"
            "host": "127.0.0.1" // optional
            "port": 6379 // optional
        }
    }
}
```

ShareJS 0.7.0+ will apparently support mongo-backed documents, but we're using Redis for now because it's stable.

## Notes

- There's currently no security on this; ShareJS is agnostic to the Meteor users. The document ids are used for access.
- It's best to create a `Meteor.Collection` for your documents which generates good unique ids to connect to ShareJS with. Use these to render the templates above.
- Importing ace dependencies is somewhat unsatisfactory. Waiting for improvements to Meteor package management system.

Please submit pull requests for better features and cooperation!
