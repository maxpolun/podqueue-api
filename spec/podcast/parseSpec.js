'use strict'
let parse = require('src/podcast/parse')
let Podcast = require('src/podcast/podcast')
let Episode = require('src/episode/episode')
let fs = require('fs')

function testFile (name) {
  return fs.createReadStream(`${__dirname}/testFiles/${name}`)
}

function testSuccess (fileName, done, cb) {
  parse(testFile(fileName))
    .then(cb)
    .catch(err => expect(err).toBeUndefined())
    .then(done, done)
}

describe('parse', () => {
  it('should parse an xml file', (done) => {
    testSuccess('simple.xml', done, podcast => {
      expect(podcast).not.toBeUndefined()
    })
  })

  it('should have meta data', (done) => {
    testSuccess('simple.xml', done, podcast => {
      expect(podcast.meta).toEqual(new Podcast({
        name: 'The History of Rome',
        description: 'A weekly podcast tracing the rise, decline and fall of the Roman Empire. Now complete!',
        feedUrl: 'http://feeds.feedburner.com/TheHistoryOfRome',
        hubUrl: 'http://pubsubhubbub.appspot.com/'
      }))
    })
  })

  it('should have items', (done) => {
    testSuccess('simple.xml', done, podcast => {
      expect(podcast.items).toEqual([
        new Episode({
          name: '001- In the Beginning',
          description: '<p>Welcome to The History of Rome, a weekly series tracing the rise and fall of the Roman Empire. Today we will hear the mythical origin story of Rome and compare it with modern historical and archaeological evidence. How much truth is wrapped up in the legend? We end this week with the death of Remus and the founding of Rome.</p><img src="http://feeds.feedburner.com/~r/TheHistoryOfRome/~4/bEECVPWDJYM" height="1" width="1" alt=""/>',
          releasedAt: new Date('Fri Jul 27 2007 20:47:00 GMT-0400 (EDT)'),
          authorGuid: '33cde82d0142aeaa882db7613212e31b',
          fileUrl: 'http://feedproxy.google.com/~r/TheHistoryOfRome/~5/mvZ6GxepKFo/01-_In_the_Beginning.mp3',
          fileFormat: 'audio/mpeg',
          fileLength: '5667112',
          fileDuration: '11:49'
        })
      ])
    })
  })
})
