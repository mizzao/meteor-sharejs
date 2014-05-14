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
