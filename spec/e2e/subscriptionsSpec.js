'use strict'
let test = require('./e2eSupport')
let User = require('src/user/user')
let Podcast = require('src/podcast/podcast')
let co = require('co')

describe('subscriptions', () => {
  let server
  beforeEach(done => {
    test.startServer()
      .then(srv => server = srv)
      .then(() => test.cleanDb())
      .then(() => test.withDb(co.wrap(function * (db) {
        let user = yield new User({
          email: 'max@example.com',
          username: 'max'
        }).save(db)
        yield db.query('COMMIT')
        let podcast = yield new Podcast({
          name: 'test',
          description: 'test',
          feedUrl: 'http://feeds.example.com/testFeed'
        }).save(db)
        yield db.query('COMMIT')
        return user.subscribeTo(db, podcast)
      })))
      .catch(err => {
        if (server) server.kill()
        expect(err.stack).toBeUndefined()
      })
      .then(done, done)
  })

  afterEach(() => {
    if (server) server.kill()
  })

  it('can get a user\'s subscriptions', (done) => {
    test.get('/users/max/subscriptions', done, res => {
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
