'use strict'
let test = require('./e2eSupport')
let User = require('src/user')
let Session = require('src/session')
let Podcast = require('src/podcast')
let Episode = require('src/episode')
let Queue = require('src/queue')
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

  let user, episode, podcast
  beforeEach(done => {
    test.withDb(co.wrap(function *(db) {
      user = yield new User({
        email: 'max@example.com',
        username: 'max',
        password: 'Password1'
      }).genHash().then(u => u.save(db))
      podcast = yield new Podcast({
        name: 'test',
        description: 'test',
        feedUrl: 'http://feeds.example.com/testFeed'
      }).save(db)
      episode = yield new Episode({
        podcastUuid: podcast.uuid,
        name: 'ep1',
        description: 'episode 1',
        releasedAt: new Date(),
        authorGuid: '12345',
        fileUrl: 'http://cdn.example.com/podcasts/test/ep1.mp3',
        fileFormat: 'audio/mpeg',
        fileLength: 12345,
        fileDuration: '5:45'
      }).save(db)
      yield Queue.push(db, user, episode)
    }))
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

    it('can get a user\'s queue', done => {
      test.get('/users/max/queue', done, { session }, res => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
          user: { uuid: user.uuid, username: user.username, email: user.email },
          items: [{
            podcastUuid: podcast.uuid,
            uuid: episode.uuid,
            name: 'ep1',
            description: 'episode 1',
            releasedAt: episode.releasedAt.toISOString(),
            authorGuid: '12345',
            fileUrl: 'http://cdn.example.com/podcasts/test/ep1.mp3',
            fileFormat: 'audio/mpeg',
            fileLength: '12345',
            fileDuration: '5:45',
            ordering: '1'
          }]
        })
      })
    })
  })
})
