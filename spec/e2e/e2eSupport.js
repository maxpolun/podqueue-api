'use strict'
let childProcess = require('child_process')
let connect = require('src/support/db')
let co = require('co')

const testPort = module.exports.testPort = 4004
const testDbUrl = 'postgres://podqueue@localhost/podqueue-test'

module.exports.testUrl = 'http://localhost:' + testPort

let query = module.exports.query = function query (q, args) {
  return connect(testDbUrl)
          .then(pg => {
            let promise = pg.client.query(q, args)
            promise.then(() => pg.done(),
                         () => pg.done())
            return promise
          })
}

module.exports.startServer = function () {
  return new Promise((resolve, reject) => {
    let child = childProcess.fork('index.js', [], {
      env: {
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

module.exports.cleanDb = function () {
  return co(function * () {
    let tables = yield query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)
    return yield tables.rows.map(t => query(`TRUNCATE TABLE ${t.table_name} CASCADE`))
  })
}
