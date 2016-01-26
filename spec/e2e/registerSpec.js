'use strict'
let test = require('./e2eSupport')
let User = require('src/user/user')

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

describe('login', () => {
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
    test.withDb(db => {
      return new User({
        username: 'max',
        email: 'max@example.com',
        password: 'Password1'
      }).genHash()
      .then(u => u.save(db))
    }).then(done, done)
  })

  it('can login', (done) => {
    test.post('/login', {
      username: 'max',
      password: 'Password1'
    }, done, res => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        sessionId: jasmine.any(String),
        userUuid: jasmine.any(String)
      })
    })
  })
})
