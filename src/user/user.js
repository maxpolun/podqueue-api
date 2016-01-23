'use strict'
let co = require('co')
let NotFound = require('../support/errors').NotFound

class User {
  constructor (params) {
    Object.assign(this, params)
  }

  save (db) {
    return db.query(`INSERT INTO users (
      email,
      username
    ) VALUES (
      $1,
      $2
    ) ON CONFLICT (uuid) DO UPDATE
    SET email = EXCLUDED.email,
        username = EXCLUDED.username
    RETURNING *`, [this.email, this.username])
  }

  static findByUsername (db, username) {
    return co(function * () {
      let result = yield db.query('SELECT * FROM users WHERE username = $1', [username])
      if (result.rows && result.rows.length === 0) {
        throw new User.NotFound(username)
      }
      return new User(result.rows[0])
    })
  }
}

class UserNotFound extends NotFound {
  constructor (username) {
    super(`User ${username}`)
  }
}

User.NotFound = UserNotFound

module.exports = User
