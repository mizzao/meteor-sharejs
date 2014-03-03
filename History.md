## v0.4.0

* Preliminary support for user-accounts integration. #6
* More robust connection on both http and https services.
* Removed any references to Redis. It's much better to use Mongo with Meteor!
* Fixed a bug that prevented editing with IE.
* Moved Ace into a submodule instead of using build-fetcher - this allows themes to be more easily supported in the future.

## v0.3.2

* Download CDN files (ace) on the server, and serve as a Meteor file. #2, #3.
