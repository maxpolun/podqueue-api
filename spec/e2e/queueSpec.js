'use strict'
let test = require('./e2eSupport')
let User = require('src/user/user')

describe('queue', () => {
  let server
  beforeEach(done => {
    test.setupE2e()
      .then(srv => server = srv)
      .then(done, done)
  })

  afterEach(() => {
    server.kill()
  })

  beforeEach(done => {
    test.withDb(db => new User({
      email: 'max@example.com',
      username: 'max',
      password: 'Password1'
    }).genHash().then(u => u.save(db)))
    .catch(err => {
      expect(err).toBeUndefined()
    })
    .then(done, done)
  })

  it('can get a user\'s queue', (done) => {
    test.get('/users/max/queue', done, res => {
      expect(res.statusCode).toBe(200)
    })
  })
})
