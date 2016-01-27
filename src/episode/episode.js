'use strict'
let BaseModel = require('../support/baseModel')
let snakeCase = require('lodash/snakeCase')
class Episode extends BaseModel {
  constructor (params) {
    super(params)

    this.releasedAt = this.releasedAt ? new Date(this.releasedAt) : null
  }

  static fromFeedItem (itemJson) {
    let enc = itemJson.enclosures[0]
    return new Episode({
      name: itemJson.title,
      description: itemJson.description,
      releasedAt: itemJson.pubDate,
      authorGuid: itemJson.guid,
      fileUrl: enc.url,
      fileFormat: enc.type,
      fileLength: enc.length,
      fileDuration: itemJson['itunes:duration']['#']
    })
  }

  create (db) {
    let keys = Object.keys(this)
    let arglist = keys.map(snakeCase).join(',')
    let insertList = keys.map((k, i) => '$' + (i + 1)).join(',')
    let params = keys.map(k => this[k])
    return db.query(`INSERT INTO episodes (${arglist}) VALUES (${insertList}) RETURNING *`, params)
              .then(result => {
                this.uuid = result.rows[0].uuid
                return this
              })
  }
}

module.exports = Episode
