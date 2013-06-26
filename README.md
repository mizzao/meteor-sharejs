meteor-sharejs
==============

Meteor smart package for transparently adding ShareJS editors to an app

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

## Notes

- There's currently no security on this; ShareJS is agnostic to the Meteor users. The document ids are used for access.
- It's best to create a `Meteor.Collection` for your documents which generates good unique ids to connect to ShareJS with. Use these to render the templates above.
- Importing ace dependencies is somewhat unsatisfactory. Waiting for improvements to Meteor package management system.
- Need a better way to specify the redis server for persistent documents.

Please submit pull requests for better features and cooperation!
