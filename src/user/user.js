'use strict'
let co = require('co')
let NotFound = require('../support/errors').NotFound
let BaseModel = require('../support/baseModel')
let Podcast = require('../podcast/podcast')
let pick = require('lodash/pick')

class User extends BaseModel {
  create (db) {
    return db.query(`INSERT INTO users (
      email,
      username
    ) VALUES (
      $1,
      $2
    ) ON CONFLICT (uuid) DO UPDATE
    SET email = EXCLUDED.email,
        username = EXCLUDED.username
    RETURNING *`, [this.email, this.username]).then(response => {
      let first = response.rows[0]
      this.uuid = this.uuid || first.uuid
      return this
    })
  }

  update (db) {
    return Promise.reject(new Error('not implimented'))
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
}

class UserNotFound extends NotFound {
  constructor (username) {
    super(`User ${username}`)
  }
}

User.NotFound = UserNotFound

module.exports = User
