'use strict'
module.exports.NotFound = class NotFound extends Error {
  constructor (what) {
    super(`${what} not found`)
  }
}
