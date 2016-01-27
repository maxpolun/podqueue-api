'use strict'
let Episode = require('../episode')
let omit = require('lodash/omit')

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
        items: results.rows.map(e => new Episode(omit(e, ['user_uuid', 'episode_uuid'])))
      })
    })
  }

  static push (db, user, episode) {
    return db.query(
      `INSERT INTO queues (user_uuid, episode_uuid, ordering)
      VALUES ($1, $2, (SELECT COALESCE(MAX(ordering), 0) + 1 FROM queues WHERE user_uuid = $3))`,
      [user.uuid, episode.uuid, user.uuid])
  }
}

module.exports = Queue
