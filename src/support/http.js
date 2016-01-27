'use strict'
let http = require('http')
let querystring = require('querystring')
let parse = require('url').parse

function genOptions (url, defaultOpts, opts) {
  let parsed = parse(url)
  return Object.assign({}, defaultOpts, opts, parsed)
}

function makeRequest (config, body, onEnd, onErr) {
  let req = http.request(config, res => {
    let str = ''
    res.on('data', chunk => str += chunk.toString())
    res.on('end', () => {
      if (/application\/json/.test(res.headers['content-type'])) {
        res.body = JSON.parse(str)
      } else {
        res.body = str
      }
      onEnd(res)
    })
    res.on('error', err => onErr(err))
  })
  req.on('error', err => onErr(err))
  if (body) {
    req.write(body)
  }
  req.end()
}

function get (url, params, options) {
  return new Promise((resolve, reject) => {
    let query = querystring.stringify(params)
    let config = genOptions(url + '?' + query, {
      method: 'GET'
    }, options)
    makeRequest(config, null, resolve, reject)
  })
}

function post (url, body, options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    let sendBody = typeof body === 'string' ? body : JSON.stringify(body)
    let config = genOptions(url, {
      method: 'POST'
    }, options)
    makeRequest(config, sendBody, resolve, reject)
  })
}

module.exports = {
  get: get,
  post: post
}
