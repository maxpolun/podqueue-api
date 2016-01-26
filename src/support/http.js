'use strict'
let http = require('http')
let querystring = require('querystring')
let parse = require('url').parse

function get (url, params) {
  return new Promise((resolve, reject) => {
    let query = querystring.stringify(params)
    http.get(url + '?' + query, res => {
      let str = ''
      res.on('data', chunk => str += chunk.toString())
      res.on('end', () => {
        if (/application\/json/.test(res.headers['content-type'])) {
          res.body = JSON.parse(str)
        } else {
          res.body = str
        }

        resolve(res)
      })
      res.on('error', err => reject(err))
    }).on('error', err => reject(err))
  })
}

function post (url, body, options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    let sendBody = typeof body === 'string' ? body : JSON.stringify(body)
    let parsed = parse(url)
    let config = Object.assign({}, {
      method: 'POST'
    }, options, parsed)
    let req = http.request(config, res => {
      res.body = ''
      res.on('data', chunk => res.body += chunk.toString())
      res.on('end', () => {
        if (/json/.test(res.headers['content-type'])) {
          res.body = JSON.parse(res.body)
        }
        resolve(res)
      })
    })
    req.on('error', err => reject(err))
    req.write(sendBody)
    req.end()
  })
}

module.exports = {
  get: get,
  post: post
}
