'use strict'
let test = require('./e2eSupport')
let User = require('src/user/user')
let Session = require('src/session/session')
let co = require('co')

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

  let user
  beforeEach(done => {
    test.withDb(db => new User({
      email: 'max@example.com',
      username: 'max',
      password: 'Password1'
    }).genHash().then(u => u.save(db)).then(u => user = u))
    .catch(err => {
      done.fail(err)
    })
    .then(done, done)
  })
  it('401s when not authenticated', done => {
    test.get('/users/max/queue', done, res => {
      expect(res.statusCode).toBe(401)
    })
  })
  it('403s when authenticated to the wrong user', done => {
    test.withDb(co(function *(db) {
      let user = new User({
        email: 'notmax@example.com',
        username: 'notmax',
        password: 'Password2'
      }).genHash().then(u => u.save(db))
      let session = new Session({
        userUuid: user.uuid
      }).save(db)
      test.get('/users/max/queue', done, {session}, res => {
        expect(res.statusCode).toBe(403)
      })
    }))
  })

  describe('when authenticated', () => {
    let session

    beforeEach(done => {
      test.withDb(db => new Session({
        userUuid: user.uuid
      }).save(db)
        .then(s => session = s))
        .then(done, done)
    })

    it('can get a user\'s queue', (done) => {
      test.get('/users/max/queue', done, { session }, res => {
        expect(res.statusCode).toBe(200)
      })
    })
  })
})
