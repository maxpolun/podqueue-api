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
      res.on('end', () => resolve(str))
      res.on('error', err => reject(err))
    }).on('error', err => reject(err))
  })
}

function post (url, body, options) {
  options = options || {}
  return new Promise((resolve, reject) => {
    let parsed = parse(url)
    let config = Object.assign({}, {
      method: 'POST'
    }, options, parsed)
    let req = http.request(config, res => {
      res.body = ''
      res.on('data', chunk => res.body += chunk.toString())
      res.on('end', () => resolve(req))
    })
    req.on('error', err => reject(err))
    req.write(body)
    req.end()
  })
}

module.exports = {
  get: get,
  post: post
}
