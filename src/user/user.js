'use strict'
let co = require('co')
let NotFound = require('../support/errors').NotFound
let BadRequest = require('../support/errors').BadRequest
let AuthenticationError = require('../support/errors').AuthenticationError
let BaseModel = require('../support/baseModel')
let Podcast = require('../podcast')
let pick = require('lodash/pick')
let bcrypt = require('bcrypt')

class User extends BaseModel {
  create (db) {
    return db.query(`INSERT INTO users (
      email,
      username,
      pw_hash
    ) VALUES (
      $1,
      $2,
      $3
    )
    RETURNING *`, [this.email, this.username, this.pw_hash]).then(response => {
      let first = response.rows[0]
      this.uuid = this.uuid || first.uuid
      return this
    })
  }

  update (db) {
    return Promise.reject(new Error('not implimented'))
  }

  verify () {
    return new Promise((resolve, reject) => {
      let errors = []

      if (errors.length === 0) {
        resolve(this)
      } else {
        reject(new BadRequest(errors))
      }
    })
  }

  static hash (password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return reject(err)
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) return reject(err)
          resolve(hashedPassword)
        })
      })
    })
  }

  genHash () {
    return User.hash(this.password)
      .then(hashed => {
        this.pw_hash = hashed
        return this
      })
  }

  isAuthentic (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.pwHash, (err, result) => {
        if (err) return reject(new AuthenticationError(err))
        resolve(result)
      })
    })
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

  subscribeTo (db, podcast) {
    return db.query(`INSERT INTO subscriptions
      (user_uuid, podcast_uuid)
    VALUES
      ($1, $2)`, [this.uuid, podcast.uuid])
  }

  subscriptions (db) {
    return db.query(`
      SELECT * FROM
        podcasts, subscriptions
      WHERE
        podcasts.uuid = subscriptions.podcast_uuid
          AND
        subscriptions.user_uuid = $1`, [this.uuid])
      .then(results => results.rows.map(row => new Podcast(pick(row, 'uuid', 'name', 'description', 'feed_url', 'hub_url', 'lease_seconds'))))
  }

  toJSON () {
    return {
      uuid: this.uuid,
      username: this.username,
      email: this.email
    }
  }
}

class UserNotFound extends NotFound {
  constructor (username) {
    super(`User ${username}`)
  }
}

User.NotFound = UserNotFound

module.exports = User
