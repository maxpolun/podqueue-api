'use strict'

let koa = require('koa')
let koaLogger = require('koa-logger')
let router = require('koa-router')()
let koaBody = require('koa-body')()

let dbMiddleware = require('./middlewares/db')
let errorMiddleware = require('./middlewares/error')
let authenticateMiddleware = require('./middlewares/authenticate')
let userMiddleware = require('./middlewares/user')

let config = require('./config/config')

let User = require('./user')
let Queue = require('./queue')
let Session = require('./session')
let errors = require('./support/errors')

require('./pubsub').listener(router)

router.param('username', userMiddleware)

router.get('/users/:username', authenticateMiddleware, function * () {
  let user = yield User.findByUsername(this.db, this.params.username)
  this.body = user
})

router.get('/users/:username/queue', authenticateMiddleware, function * () {
  let queue = yield Queue.findByUsername(this.db, this.params.username)
  this.body = queue
})

router.get('/users/:username/subscriptions', authenticateMiddleware, function * () {
  let user = yield User.findByUsername(this.db, this.params.username)
  this.body = yield user.subscriptions(this.db)
})

router.post('/register', koaBody, function * () {
  let user = new User(this.request.body)
  yield user.verify()
  yield user.genHash()
  yield user.save(this.db)
  this.body = user
})

function badUsernameOrPassword (ctx) {
  ctx.status = 400
  ctx.body = {errors: ['bad username or password']}
}

router.post('/login', koaBody, function * () {
  try {
    let user = yield User.findByUsername(this.db, this.request.body.username)
    if (yield user.isAuthentic(this.request.body.password)) {
      this.body = yield new Session({
        userUuid: user.uuid
      }).save(this.db)
    } else {
      badUsernameOrPassword(this)
    }
  } catch (e) {
    if (e instanceof errors.NotFound || e instanceof errors.AuthenticationError) {
      badUsernameOrPassword(this)
    } else {
      throw e
    }
  }
})

let app = koa()
if (config.logRequests) {
  app.use(koaLogger())
}

app.use(errorMiddleware)
    .use(dbMiddleware(config.dbUrl))
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(config.port, () => {
  if (config.logRequests) {
    console.log(`starting on port ${config.port}`)
  }
  if (process.send) {
    // started as child process, so signal that the server started
    process.send('started')
  }
})
