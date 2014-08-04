meteor-sharejs [![Build Status](https://travis-ci.org/mizzao/meteor-sharejs.svg)](https://travis-ci.org/mizzao/meteor-sharejs)
==============

Meteor smart package for transparently adding [ShareJS](https://github.com/share/ShareJS) editors to an app. Includes the [Ace editor](http://ace.c9.io/).

Demo app: http://documents.meteor.com ([source](demo))

## Install

```
$ mrt add sharejs
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

The templates will clean themselves up when re-rendered (i.e., you have several documents and docid changes.)

## Client Configuration

For the Ace editor, you can define `onRender` and `onConnect` callbacks in the options hash and use it to configure the editor. `onRender` is called when the editor is initially rendered, and `onConnect` is called after each successful connection to a document.

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

### Persistence

By default, the documents and edit operations will be persisted in Meteor's Mongo database. Mongo is the recommended usage as you don't need a separate database and user integration is supported. `"opsCollectionPerDoc": false` can be useful to set if you don't want a separate ops collection for each document.

You can also use `db.type` of `none` to have all documents and operations in memory.

### Meteor User-Accounts Integration

In case you are using Mongo to mirror the internal sharejs DB with an external Meteor collection as in the user-accounts demo app (find it [here](https://github.com/kbdaitch/meteor-documents-demo) deployed on [meteor](http://documents-users.meteor.com)), both authorization and authentication are available using the [ShareJS auth mechanism](https://github.com/share/ShareJS/wiki/User-access-control).

The use of this feature becomes effective if you store addional metadata such as owners and invites in the document collection like [here](https://github.com/kbdaitch/meteor-documents-demo/blob/master/client/client.coffee#L22) in the demo app.

Your settings file should look like the following:

```js
{
  "sharejs": {
    "options": {
      "accounts_auth": {
        "authorize": {
            "collection": "documents",
            "token_validations": {
              "or": {
                "invitedUsers": "is_in_array",
                "userId": "is_equal"
              }
            },
            "apply_on": [
              "read",
              "update",
              "create",
              "delete"
            ]
        },
        "authenticate": {
            "collection": "users",
            "token_validations": {
              "_id": "is_equal"
            }
        }
      }
    }
  }
}
```

All authorize and authenticate settings are under their respective categories. Please note that both of them are completely optional, however once present, they must have at least a field called `collection`.

* `sharejs.options.accounts_auth.authorize`
* `sharejs.options.accounts_auth.authenticate`

The sub-categories for both define the allowed operations and validation.

* `collection`: database collection to fetch the document/user metadata from.
* `token_validations`: contains the boolean logic and supports the keywords `is_equal`, `isnt_equal`, `is_in_array` and `isnt_in_array`. Both `or` and `and` logical operators can be used, provided at any one level of JSON, there is only one or none of them.
* `apply_on`: you can select operations from [here](https://github.com/share/ShareJS/wiki/User-access-control#actions) `Type` column except `connect` which is reserved for authentication.

### Validations

All validations are run against the token. The client-side of sharejs auth would use `Meteor.userId()` for the token. So, for a returned document from database, the following will check for equality of `userId` and token or presence of token in `invitedUsers`.

```js
"token_validations": {
  "or": {
    "userId": "is_equal",
    "invitedUsers": "is_in_array"
  }
}
```

### Authentication

Usually, the presence of the user in the collection is sufficient for allowing the connection to sharejs. However, criteria such as the following can also be used.

```js
"token_validations": {
  "_id": "is_equal"
}
```

## Advanced

You can access the [ShareJS Server API](https://github.com/share/ShareJS/wiki/Server-api) at `ShareJS.model`. For example, you may want to delete documents ops when the document is deleted in your app. See the demo for an example.

## Notes

- When using the default mongo driver, you must not use collections called `docs` or `ops`. [These are used by ShareJS](https://github.com/share/ShareJS/blob/v0.6.2/src/server/db/mongo.coffee).
- When not using accounts integration, ShareJS is agnostic to the Meteor users, and doesn't keep track of who did what op. The document ids are used for access.
- It's best to create a `Meteor.Collection` for your documents which generates good unique ids to connect to ShareJS with. Use these to render the templates above. See the [demo](demo) for examples.
- Importing ace dependencies is somewhat unsatisfactory. Waiting for improvements to Meteor package management system.

Please submit pull requests for better features and cooperation!

## Contributors

* Andrew Mao (https://github.com/mizzao/)
* Karan Batra-Daitch (https://github.com/kbdaitch)
