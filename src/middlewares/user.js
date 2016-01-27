'use strict'
let User = require('../user')
module.exports = function * (username, next) {
  this.user = yield User.findByUsername(this.db, username)
  yield next
}
