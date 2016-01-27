'use strict'
let FeedParser = require('feedparser')
let Podcast = require('./podcast')
let Episode = require('../episode')

module.exports = function parse (inputStream) {
  return new Promise((resolve, reject) => {
    let parser = new FeedParser()
    let items = []
    inputStream.pipe(parser)

    parser.on('error', err => reject(err))
    parser.on('readable', () => {
      let item = parser.read()
      while (item) {
        items.push(item)
        item = parser.read()
      }
    })
    parser.on('end', () => {
      resolve({
        meta: Podcast.fromFeed(parser.meta),
        items: items.map(Episode.fromFeedItem)
      })
    })
  })
}
