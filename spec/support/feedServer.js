'use strict'
let koa = require('koa')
let fs = require('fs')
let path = require('path')
let koaRouter = require('koa-router')

module.exports = class FeedServer {
  constructor (options) {
    this.dir = options.dir
    this.port = options.port
    this.server = null
  }

  start () {
    let self = this
    let app = koa()
    let router = koaRouter()

    router.get('/feeds/:feed', function * () {
      this.body = fs.createReadStream(path.join(self.dir, this.params.feed))
    })

    app
      .use(router.routes())
      .use(router.allowedMethods())

    this.server = app.listen(this.port)
  }

  stop () {
    if (this.server) this.server.close()
  }
}
