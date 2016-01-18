'use strict'
let koa = require('koa')
let koaLogger = require('koa-logger')
let router = require('koa-router')()
let koaBody = require('koa-body')()

router.get('/', koaBody, function * () {
  this.body = {hello: 'world'}
})

let app = koa()

app.use(koaLogger())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(4000, () => console.log('starting on port 4000'))
