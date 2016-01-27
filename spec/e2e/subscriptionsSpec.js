'use strict'
let test = require('./e2eSupport')
let User = require('src/user/user')
let Podcast = require('src/podcast/podcast')
let Session = require('src/session/session')
let co = require('co')

describe('subscriptions', () => {
  let server, session
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
      let user = yield new User({
        email: 'max@example.com',
        username: 'max',
        password: 'Password1'
      }).genHash().then(u => u.save(db))
      session = yield new Session({userUuid: user.uuid}).save(db)
      yield db.query('COMMIT')
      let podcast = yield new Podcast({
        name: 'test',
        description: 'test',
        feedUrl: 'http://feeds.example.com/testFeed'
      }).save(db)
      yield db.query('COMMIT')
      return user.subscribeTo(db, podcast)
    }))
    .catch(err => {
      expect(err).toBeUndefined()
    })
    .then(done, done)
  })

  it('can get a user\'s subscriptions', (done) => {
    test.get('/users/max/subscriptions', done, {session}, res => {
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([
        {
          uuid: jasmine.any(String),
          name: 'test',
          description: 'test',
          feedUrl: 'http://feeds.example.com/testFeed',
          hubUrl: null,
          leaseSeconds: null
        }
      ])
    })
  })
})
