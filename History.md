## vNEXT

## v0.7.3

* Remove the unnecessary Mongo driver reference entirely.

## v0.7.2

* Update references to Mongo driver to support Meteor 1.0.4.

## v0.7.1

* Update format of config callbacks (caused #41 prior to being released.)

## v0.7.0

* **The base ShareJS package and the Ace and CodeMirror editors are now different meteor packages.** `mizzao:sharejs` only has raw text editing, while `mizzao:sharejs-ace` provides the Ace editor and `mizzao:sharejs-codemirror` provides CodeMirror.  

## v0.6.1 

* **Update and publish package for Meteor 0.9.2 or later**.
* Create separate `onRender` and `onConnect` callbacks for the Ace editor.

## v0.6.0

* Updated for Meteor 0.8.3, integrating document switching with `Blaze.View`. See the updated demo. Changing the `docId` element of the helper no longer triggers a re-render.
* Bump ShareJS version to 0.6.3.
* Set Ace config callback to run after the editor has been rendered.
* Created a helper function to create a document on the server, and added a couple of tests (implicitly testing the rest of the stack.)
* Set the default value of `opsCollectionPerDoc` to `false` for the ShareJS Mongo driver. This reduces the amount of collection namespace pollution. **However, you will need to migrate your data from the previous per-document collections if you didn't use this option in an earlier version of this package.** Otherwise, your previous documents will be empty when your app loads. You can also override this behavior and use your previous schema by including the following in `Meteor.settings`:

    ```json
    {
        "sharejs": {
            "options": {
                "db": {
                    "type": "mongo",
                    "opsCollectionPerDoc": true
                }
            }
        }
    }
    ```
* Store the Meteor `userId` in the ShareJS ops collection through some egregious monkey-patching. Hopefully the modularity of ShareJS 0.7 will make this easier; to make sure this happens, you should pitch in at https://github.com/share/ShareJS/issues/286.

## v0.5.2

* Added built-in support for loading Ace editor extensions and themes.

## v0.5.1

* Fixed an issue with the Ace submodule repository path.

## v0.5.0

* Hacked up support for Meteor 0.8.0 (Blaze). Expect changes as Meteor's UI API improves.

## v0.4.0

* Preliminary support for user-accounts integration. #6
* More robust connection on both http and https services.
* Removed any references to Redis. It's much better to use Mongo with Meteor!
* Fixed a bug that prevented editing with IE.
* Moved Ace into a submodule instead of using build-fetcher - this allows themes to be more easily supported in the future.

## v0.3.2

* Download CDN files (ace) on the server, and serve as a Meteor file. #2, #3.
