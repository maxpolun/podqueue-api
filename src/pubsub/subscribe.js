'use strict'
// Subscribe to pubsubhubbub hub
let http = require('http')
let url = require('url')
let encode = require('form-urlencoded')
let config = require('../config/config.js')

function post (hubUrl, form) {
  return new Promise((resolve, reject) => {
    let body = encode(form)
    let parsed = url.parse(hubUrl)
    let defaultConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length
      }
    }
    let config = Object.assign({}, defaultConfig, parsed)

    let request = http.request(config, response => {
      if (response.statusCode >= 400) reject(response.statusCode)

      resolve()
    })

    request.on('error', err => reject(err))
    request.write(body)
    request.end()
  })
}

module.exports = function subscribe (options) {
  let hubUrl, topicUrl, podcastUuid
  hubUrl = options.hubUrl
  topicUrl = options.topicUrl
  podcastUuid = options.podcastUuid
  return post(hubUrl, {
    'hub.callback': config.baseUrl + `/subscriptions/${podcastUuid}`,
    'hub.mode': 'subscribe',
    'hub.topic': topicUrl
  })
}
