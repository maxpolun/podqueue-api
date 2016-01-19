'use strict'
let koa = require('koa')
let koaLogger = require('koa-logger')
let router = require('koa-router')()
let koaBody = require('koa-body')()

let dbMiddleware = require('./middlewares/db')

router.get('/', koaBody, function * () {
  this.body = (yield this.db.query('SELECT * FROM users')).rows
})

let app = koa()

app.use(koaLogger())
    .use(dbMiddleware(process.env.DATABASE_URL || 'postgres://podqueue@localhost/podqueue-dev'))
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(4000, () => console.log('starting on port 4000'))
