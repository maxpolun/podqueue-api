'use strict'
let BaseModel = require('../support/baseModel')

class Podcast extends BaseModel {
  create (db) {
    return db.query(
      `INSERT INTO podcasts (name, description, feed_url, hub_url, lease_seconds)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`, [this.name, this.description, this.feedUrl, this.hubUrl, this.leaseSeconds])
      .then(response => {
        let first = response.rows[0]
        this.uuid = this.uuid || first.uuid
        return this
      })
  }

  update (db) {
    return Promise.reject(new Error('not implimented'))
  }

  static fromFeed (feedJson) {
    let link = parseLinkTags(feedJson)
    return new Podcast({
      name: feedJson.title,
      description: feedJson.description,
      feedUrl: link.self,
      hubUrl: link.hub
    })
  }
}

function parseLinkTags (feedJson) {
  let tags = feedJson['atom10:link']
  let link = {}

  tags.map(tag => tag['@']).forEach(tag => {
    link[tag.rel] = tag.href
  })
  return link
}

module.exports = Podcast
