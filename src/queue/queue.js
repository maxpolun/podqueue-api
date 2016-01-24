'use strict'
let co = require('co')
let User = require('../user/user')

class Queue {
  constructor (params) {
    Object.assign(this, params)
  }

  static findByUsername (db, username) {
    return co(function * () {
      let user = yield User.findByUsername(db, username)
      let results = yield db.query(
        `SELECT
          *
        FROM
          episodes,
          queues
        WHERE
          queues.episode_uuid = episodes.uuid AND
          queues.user_uuid = $1
        ORDER BY
          queues.ordering ASC;`, [user.uuid])
      return new Queue({
        user: user,
        items: results.rows
      })
    })
  }
}

module.exports = Queue
