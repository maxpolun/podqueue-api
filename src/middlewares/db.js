'use strict'
let connect = require('../support/db')
module.exports = function (dbUrl) {
  return function * (next) {
    let db = yield connect(dbUrl)
    this.db = db.client
    yield next
    db.done()
  }
}
