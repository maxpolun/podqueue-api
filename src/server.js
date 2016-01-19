'use strict'
let koa = require('koa')
let koaLogger = require('koa-logger')
let router = require('koa-router')()
let koaBody = require('koa-body')()

let dbMiddleware = require('./middlewares/db')

let config = require('./config/config')

require('./pubsub').listener(router)

router.get('/', koaBody, function * () {
  this.body = (yield this.db.query('SELECT * FROM users')).rows
})

let app = koa()

app.use(koaLogger())
    .use(dbMiddleware(config.dbUrl))
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(config.port, () => console.log(`starting on port ${config.port}`))
