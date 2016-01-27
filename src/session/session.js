'use strict'
let BaseModel = require('../support/baseModel')
let crypto = require('crypto')

module.exports = class Session extends BaseModel {
  constructor (params) {
    super(params)
  }

  create (db) {
    return this.genId().then(() => {
      return db.query(`INSERT INTO sessions (session_id, user_uuid, expires_at) VALUES ($1, $2, $3)`,
          [this.sessionId, this.userUuid, this.expiresAt])
    }).then(() => this)
  }

  genId () {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(128, (err, buf) => {
        if (err) return reject(err)
        this.sessionId = buf.toString('base64')
        resolve(this)
      })
    })
  }

  static findById (db, sessionId) {
    return db.query(`SELECT * FROM sessions WHERE session_id = $1`, [sessionId])
              .then(results => {
                return new Session(results.rows[0])
              })
  }

  expired () {
    if (!this.expiresAt) return false
    return Date.now() > this.expiresAt.getTime()
  }
}
