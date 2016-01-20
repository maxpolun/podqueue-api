'use strict'
let listener = require('src/pubsub/listener')
let testHub = require('../support/testHub')

let koa = require('koa')
let koaRouter = require('koa-router')

const podcastUuid = 'bf19be0e-bfbd-11e5-96ec-3c15c2ca3dc6'
const topic = 'http://google.com'

describe('verification', () => {
  let hub, server
  beforeEach(() => {
    hub = testHub(4001)
    hub.start()

    let app = koa()
    let router = koaRouter()
    listener(router)
    app
      .use(router.routes())
      .use(router.allowedMethods())
    server = app.listen(4002)
  })

  afterEach(() => {
    hub.stop()
    server.close()
  })

  it('echos the verification code', (done) => {
    hub.subscriptions = [{
      topic: topic,
      callback: `http://localhost:4002/subscriptions/${podcastUuid}`,
      verified: false
    }]
    hub.verifySubs('xyz', 5000)
        .catch(err => expect(err).toBeUndefined())
        .then(done, done)
  })
})
