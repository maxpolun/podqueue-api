'use strict'

let koa = require('koa')
let koaLogger = require('koa-logger')
let router = require('koa-router')()
let koaBody = require('koa-body')()

let dbMiddleware = require('./middlewares/db')
let errorMiddleware = require('./middlewares/error')

let config = require('./config/config')

let User = require('./user/user.js')
let Queue = require('./queue/queue.js')

require('./pubsub').listener(router)

router.get('/', koaBody, function * () {
  this.body = (yield this.db.query('SELECT * FROM users')).rows
})

router.get('/users/:username', function * () {
  let user = yield User.findByUsername(this.db, this.params.username)
  this.body = user
})

router.get('/users/:username/queue', function * () {
  let queue = yield Queue.findByUsername(this.db, this.params.username)
  this.body = queue
})

let app = koa()

app.use(koaLogger())
    .use(errorMiddleware)
    .use(dbMiddleware(config.dbUrl))
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(config.port, () => {
  console.log(`starting on port ${config.port}`)
  if (process.send) {
    // started as child process, so signal that the server started
    process.send('started')
  }
})
