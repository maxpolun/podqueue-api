Podqueue-api
============

This is the API server for the podqueue.com service. For documentation on the API, see [the docs](doc/api.md). For deployment docs, see [the deploy guide](doc/deploy.md). For a local dev setup, see below.

## Local dev setup

* Install node >= 4.2
* Install and run postgres on the default port
* run `script/init.sh`
* run `script/update.sh`
* run `npm start`

Some other commands that may be helpful:

* `npm run watch` use instead of `npm start` to auto-restart server
* `npm run watch-tests` to automatically run the tests in the background
* `npm test` to run tests once
