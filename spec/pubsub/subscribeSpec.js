'use strict'
let subscribe = require('src/pubsub/subscribe')
let testHub = require('../support/testHub')

const hubUrl = 'http://localhost:4001'
const podcastUuid = 'bf19be0e-bfbd-11e5-96ec-3c15c2ca3dc6'
const topic = 'http://google.com'

describe('subscribe', () => {
  let hub

  beforeEach(() => {
    hub = testHub(4001)
    hub.start()
  })

  afterEach(() => {
    hub.stop()
  })

  it('adds a subscription', (done) => {
    subscribe({
      hubUrl: hubUrl,
      topicUrl: topic,
      podcastUuid: podcastUuid
    }).then(() => {
      expect(hub.subscriptions).toEqual([{
        topic: topic,
        callback: `http://localhost:4000/subscriptions/${podcastUuid}`,
        verified: false
      }])
    })
    .catch(err => expect(err).toBeUndefined())
    .then(done, done)
  })
})
