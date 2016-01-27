'use strict'

class Queue {
  constructor (params) {
    Object.assign(this, params)
  }

  static findByUser (db, user) {
    return db.query(
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
    .then(results => {
      return new Queue({
        user: user,
        items: results.rows
      })
    })
  }
}

module.exports = Queue
