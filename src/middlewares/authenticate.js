'use strict'
let Session = require('../session')
let errors = require('../support/errors')

function badSession (ctx) {
  ctx.status = 403
  ctx.body = {errors: ['bad or expired session']}
}

function noSession (ctx) {
  ctx.status = 401
  ctx.body = {errors: ['login required and no session provided']}
}

module.exports = function * (next) {
  let header = this.request.headers.authorization
  if (!header) return noSession(this)
  let sessionId = /Bearer (.*)/.exec(header)[1]
  if (!sessionId) return noSession(this)

  try {
    let session = yield Session.findById(this.db, sessionId)
    if (session.expired()) {
      return badSession(this)
    }
    if (this.user && session.userUuid !== this.user.uuid) {
      return badSession(this)
    }
  } catch (e) {
    if (e instanceof errors.NotFound) {
      return badSession(this)
    }
    throw e
  }

  yield next
}
