meteor-sharejs
==============

Meteor smart package for transparently adding ShareJS editors to an app

## Install

```
$ mrt add sharejs
```

## Config

Add the following to a config file, i.e. `settings.json`. This file is needed to specify the port for the ShareJS server.

```
{
    "public": {
        "sharejs" : {
            "port" : 3005
        }
    }
}
```

When starting meteor, specify this config file:

```
$ meteor --settings settings.json
```

## Usage

Tell ShareJS to start with the server. Put the following either in a `server/` file or wrapped in a `if (Meteor.isServer)`:

```
Meteor.startup ->
  Meteor.startShareJS()
```

Use this helper on the client to get a `textarea` with the specified document id and with a DOM id of "editor", for example:

```
{{sharejsText document id="editor"}}
```

## Notes

- There's currently no security on this; ShareJS runs on a different server which is agnostic to the Meteor users. The document ids are used for access.
- It's best to create a `Meteor.Collection` for your documents which generates good unique ids to connect to ShareJS with. Use these to render the templates above.
- Currently only textareas are supported, but will add ace editors as well. Shouldn't be too complicated.
- Need a better way to specify the redis server for persistent documents.

Please submit pull requests for better features and cooperation!
