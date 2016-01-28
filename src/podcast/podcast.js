'use strict'
let BaseModel = require('../support/baseModel')
let uniq = require('lodash/uniq')

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
  let namespaces = findNs(feedJson, 'http://www.w3.org/2005/Atom')
  let tags = findAllTags(feedJson, namespaces, 'link')
  let link = {}

  if (tags) {
    tags.map(tag => tag['@']).forEach(tag => {
      link[tag.rel] = tag.href.replace(/'/g, '')
    })
  }

  return link
}

function toPair (obj) {
  let key = Object.keys(obj)[0]
  return [key, obj[key]]
}

function findNs (feedJson, url) {
  return uniq(feedJson['#ns']
            .map(toPair)
            .filter(pair => pair[1] === url)
            .map(pair => pair[0].replace('xmlns:', '')))
}

function findAllTags (feedJson, namespaces, tagname) {
  let tags = []
  namespaces.forEach(ns => {
    let tag = feedJson[ns + ':' + tagname]
    if (tag) {
      if (tag instanceof Array) {
        tags = tags.concat(tag)
      } else {
        tags.push(tag)
      }
    }
  })
  return tags
}

module.exports = Podcast
