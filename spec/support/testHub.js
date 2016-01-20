'use strict'
// a simple pubsubhubbub server built for testing
let koa = require('koa')
let koaBody = require('koa-body')
let http = require('http')
let querystring = require('querystring')
let parse = require('url').parse
let koaLogger = require('koa-logger')

class PubSubServer {
  constructor (port, shouldLog) {
    this.port = port
    this.server = null
    this.subscriptions = []
    this.shouldLog = shouldLog || false
  }

  start () {
    this.app = this.createApp()
    this.server = this.app.listen(this.port)
  }

  createApp () {
    let app = koa()
    app.use(koaBody())
    if (this.shouldLog) app.use(koaLogger())

    let self = this

    app.use(function * () {
      if (this.request.method !== 'POST') {
        this.throw(404)
      }

      if (!this.request.is('application/x-www-form-urlencoded')) {
        this.throw(415)
      }

      let sub = self.parseSubscription(this.request.body)
      if (sub) {
        self.subscriptions.push(sub)
        this.response.status = 202
        this.response.body = ''
      } else {
        this.throw(400)
      }
    })

    return app
  }

  stop () {
    if (this.server) this.server.close()
  }

  parseSubscription (body) {
    let hub = body.hub
    if (hub.mode !== 'subscribe') {
      return null
    }
    if (!hub.topic || !hub.callback) {
      return null
    }

    return {
      topic: hub.topic,
      callback: hub.callback,
      verified: false
    }
  }

  verifySubs (challenge, leaseSeconds) {
    leaseSeconds = leaseSeconds || 4000
    return Promise.all(this.subscriptions.filter(sub => !sub.verified).map(sub => {
      return this.get(sub.callback, {
        'hub.mode': 'subscribe',
        'hub.topic': sub.topic,
        'hub.challenge': challenge,
        'hub.lease_seconds': leaseSeconds
      })
    })).then(bodies => {
      if (bodies.some(body => body !== challenge)) {
        throw new Error('challenge not satisfied')
      }
    })
  }

  updateTopic (topic, content) {
    return Promise.all(this.subscriptions.filter(sub => sub.topic === topic).map(sub => {
      return this.post(sub.callback, content)
    }))
  }

  get (url, params) {
    return new Promise((resolve, reject) => {
      let query = querystring.stringify(params)
      http.get(url + '?' + query, res => {
        let str = ''
        res.on('data', chunk => str += chunk.toString())
        res.on('end', () => resolve(str))
        res.on('error', err => reject(err))
      }).on('error', err => reject(err))
    })
  }

  post (url, body) {
    return new Promise((resolve, reject) => {
      let parsed = parse(url)
      let config = Object.assign({}, {
        method: 'POST'
      }, parsed)
      let req = http.request(config, res => {
        res.on('end', () => resolve())
      })
      req.on('error', err => reject(err))
      req.write(body)
      req.end()
    })
  }
}

module.exports = function (port) {
  return new PubSubServer(port)
}
