'use strict'
let test = require('./e2eSupport')

describe('register', () => {
  let server
  beforeEach(done => {
    test.setupE2e()
      .then(srv => server = srv)
      .then(done, done)
  })

  afterEach(() => {
    server.kill()
  })

  it('can register a user', (done) => {
    test.post('/register', {
      username: 'max',
      email: 'max@example.com',
      password: 'Password1'
    }, done, res => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        uuid: jasmine.any(String),
        username: 'max',
        email: 'max@example.com'
      })
    })
  })
})
