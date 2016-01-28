'use strict'
let test = require('./e2eSupport')
let User = require('src/user')
let Podcast = require('src/podcast')
let Session = require('src/session')
let co = require('co')

describe('subscriptions', () => {
  let server, user, session, podcast, podcast2
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
      user = yield new User({
        email: 'max@example.com',
        username: 'max',
        password: 'Password1'
      }).genHash().then(u => u.save(db))
      session = yield new Session({userUuid: user.uuid}).save(db)
      podcast = yield new Podcast({
        name: 'test',
        description: 'test',
        feedUrl: 'http://feeds.example.com/testFeed'
      }).save(db)
      podcast2 = yield new Podcast({
        name: 'test2',
        description: 'test2',
        feedUrl: 'http://feeds.example.com/testFeed2'
      }).save(db)
      return user.subscribeTo(db, podcast)
    }))
    .catch(err => done.fail(err))
    .then(done, done)
  })

  it('can get a user\'s subscriptions', done => {
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

  it('can create a new subscription', done => {
    test.post('/users/max/subscriptions', {podcastUuid: podcast2.uuid}, done, {session}, res => {
      expect(res.statusCode).toEqual(201)
      return test.withDb(db => user.subscriptions(db))
                .then(subs => expect(subs.length).toEqual(2))
    })
  })
})
