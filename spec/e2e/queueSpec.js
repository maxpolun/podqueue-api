'use strict'
let test = require('./e2eSupport')
let User = require('src/user/user')

describe('queue', () => {
  let server
  beforeEach(done => {
    test.startServer()
      .then(srv => server = srv)
      .then(() => test.cleanDb())
      .then(() => test.withDb(db => new User({
        email: 'max@example.com',
        username: 'max'
      }).save(db)))
      .catch(err => {
        if (server) server.kill()
        expect(err.stack).toBeUndefined()
      })
      .then(done, done)
  })

  afterEach(() => {
    server.kill()
  })

  it('can get a user\'s queue', (done) => {
    test.get('/users/max/queue', done, res => {
      expect(res.statusCode).toBe(200)
    })
  })
})
