'use strict'

let koa = require('koa')
let koaLogger = require('koa-logger')
let router = require('koa-router')()
let koaBody = require('koa-body')()

let dbMiddleware = require('./middlewares/db')
let errorMiddleware = require('./middlewares/error')
let authenticateMiddleware = require('./middlewares/authenticate')
let userMiddleware = require('./middlewares/user')
let corsMiddleware = require('./middlewares/cors')

let config = require('./config/config')

let User = require('./user')
let Podcast = require('./podcast')
let Queue = require('./queue')
let Session = require('./session')
let errors = require('./support/errors')
let http = require('./support/http')

let parseFeed = require('./podcast/parse')

require('./pubsub').listener(router)

router.param('username', userMiddleware)

router.get('/users/:username', authenticateMiddleware, function * () {
  this.body = this.user
})

router.get('/users/:username/queue', authenticateMiddleware, function * () {
  let queue = yield Queue.findByUser(this.db, this.user)
  this.body = queue
})

router.get('/users/:username/subscriptions', authenticateMiddleware, function * () {
  this.body = yield this.user.subscriptions(this.db)
})

router.post('/users/:username/subscriptions', koaBody, authenticateMiddleware, function * () {
  yield this.user.subscribeTo(this.db, new Podcast({uuid: this.request.body.podcastUuid}))
  this.status = 201
})

router.post('/import/podcast', koaBody, function * () {
  let res = yield http.get(this.request.body.feedUrl, {}, {raw: true})
  let feed = yield parseFeed(res)
  yield feed.meta.save(this.db)
  this.body = feed.meta
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
      let session = yield new Session({
        userUuid: user.uuid
      }).save(this.db)
      this.body = session
    } else {
      return badUsernameOrPassword(this)
    }
  } catch (e) {
    if (e instanceof errors.NotFound || e instanceof errors.AuthenticationError) {
      return badUsernameOrPassword(this)
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
    .use(corsMiddleware)
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
