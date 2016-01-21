'use strict'
class Podcast {
  constructor (params) {
    Object.assign(this, params)
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
