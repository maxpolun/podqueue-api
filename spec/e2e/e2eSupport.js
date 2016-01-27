'use strict'
let childProcess = require('child_process')
let connect = require('src/support/db')
let co = require('co')
let http = require('src/support/http')

const testPort = module.exports.testPort = 4004
const testDbUrl = 'postgres://podqueue@localhost/podqueue-test'

const testUrl = module.exports.testUrl = 'http://localhost:' + testPort

module.exports.withDb = function (cb) {
  return connect(testDbUrl).then(db => {
    return cb(db.client).then(val => { db.done(); return val })
  })
}

let query = module.exports.query = function query (q, args) {
  return connect(testDbUrl)
          .then(pg => {
            let promise = pg.client.query(q, args)
            promise.then(() => pg.done(),
                         () => pg.done())
            return promise
          })
}

let startServer = module.exports.startServer = function () {
  return new Promise((resolve, reject) => {
    let child = childProcess.fork('index.js', [], {
      env: {
        NODE_ENV: 'test',
        PORT: testPort,
        DATABASE_URL: testDbUrl
      }
    })
    child.on('error', err => {
      child.kill()
      reject(err)
    })
    child.on('message', message => {
      if (message === 'started') {
        resolve(child)
      }
    })
  })
}

module.exports.get = function (path, done, options, cb) {
  if (!cb) {
    cb = options
  }
  let config = {}

  if (options.session) {
    config.headers = {
      Authorization: `Bearer ${options.session.sessionId}`
    }
  }

  http.get(testUrl + path, {}, config)
      .then(res => cb(res))
      .catch(err => done.fail(err))
      .then(done, done)
}

module.exports.post = function (path, body, done, cb) {
  http.post(testUrl + path, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => cb(res))
    .catch(err => done.fail(err))
    .then(done, done)
}

let cleanDb = module.exports.cleanDb = function () {
  return co(function * () {
    let connection = yield connect(testDbUrl)
    let tables = yield connection.client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)
    yield tables.rows.map(t => connection.client.query(`TRUNCATE TABLE ${t.table_name} CASCADE`))
    yield query('COMMIT')
    return connection.done()
  })
}

module.exports.setupE2e = function () {
  let server
  return startServer()
    .then(srv => server = srv)
    .then(() => cleanDb())
    .catch(err => {
      if (server) server.kill()
      expect(err.stack).toBeUndefined()
    })
    .then(() => server)
}
