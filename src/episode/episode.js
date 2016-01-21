'use strict'
class Episode {
  constructor (params) {
    Object.assign(this, params)
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
}

module.exports = Episode
