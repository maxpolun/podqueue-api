'use strict'
module.exports.NotFound = class NotFound extends Error {
  constructor (what) {
    super(`${what} not found`)
  }
}

module.exports.BadRequest = class BadRequest extends Error {
  constructor (msg, errors) {
    super(msg)
    this.errors = errors
  }
}

module.exports.AuthenticationError = class AuthenticationError extends Error {
  constructor () {
    super('Bad authentication')
  }
}
