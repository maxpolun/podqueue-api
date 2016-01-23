'use strict'
let test = require('./e2eSupport')
let http = require('src/support/http')
let User = require('src/user/user')

describe('queue', () => {
  let server
  beforeEach(done => {
    Promise.all([
      test.startServer(),
      test.cleanDb()
    ]).then(responses => server = responses[0])
      .then(() => test.withDb(db => new User({
        email: 'max@example.com',
        username: 'max'
      }).save(db)))
      .catch(err => expect(err).toBeUndefined())
      .then(done, done)
  })

  afterEach(() => {
    server.kill()
  })

  it('works', (done) => {
    http.get(test.testUrl + '/users/max/queue')
      .then(res => expect(res.statusCode).toBe(200))
      .catch(err => expect(err).toBeUndefined())
      .then(done, done)
  })
})
