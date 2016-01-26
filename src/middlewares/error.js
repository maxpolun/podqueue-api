'use strict'
let errors = require('../support/errors')
module.exports = function * (next) {
  try {
    yield next
  } catch (e) {
    if (e instanceof errors.NotFound) {
      this.throw(404)
    } else if (e instanceof errors.BadRequest) {
      this.throw(400, e.message, {
        errors: e.errors
      })
    } else {
      console.log('server error', e)
      this.throw(500)
    }
  }
}
