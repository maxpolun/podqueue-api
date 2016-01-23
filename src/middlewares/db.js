'use strict'
let connect = require('../support/db')
let config = require('../config/config')
module.exports = function (dbUrl) {
  return function * (next) {
    let db = yield connect(dbUrl)
    this.db = db.client
    yield next
    db.done()
    if (config.verboseLogging) {
      console.log(`${db.client.queryCount} queries made in this request`)
    }
  }
}
