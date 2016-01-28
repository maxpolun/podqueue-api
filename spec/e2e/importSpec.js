'use strict'
let test = require('./e2eSupport')
let co = require('co')

let User = require('src/user')
let Session = require('src/session')

let FeedServer = require('../support/feedServer')

describe('import', () => {
  let server, user, session
  beforeEach(done => {
    test.setupE2e()
      .then(srv => server = srv)
      .then(done, done)
  })

  afterEach(() => {
    server.kill()
  })

  beforeEach(done => {
    test.withDb(co.wrap(function * (db) {
      user = new User({
        username: 'max',
        email: 'max@example.com',
        Password: 'Password1'
      }).save(db)
      session = new Session({userUuid: user.uuid}).save(db)
    })).then(done, done)
  })

  let feedServer
  beforeEach(() => {
    feedServer = new FeedServer({
      port: 4007,
      dir: __dirname + '/files'
    })
    feedServer.start()
  })

  afterEach(() => {
    feedServer.stop()
  })

  it('can import a podcast', done => {
    test.post('/import/podcast', {
      feedUrl: 'http://localhost:4007/feeds/simpleFeed.xml'
    }, done, {session}, res => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        uuid: jasmine.any(String),
        feedUrl: 'http://localhost:4007/feeds/simpleFeed.xml',
        name: 'Test Feed',
        description: 'A simple test feed'
      })
    })
  })
})
