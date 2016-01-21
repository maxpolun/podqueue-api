'use strict'
// Subscribe to pubsubhubbub hub
let http = require('../support/http')
let encode = require('form-urlencoded')
let config = require('../config/config.js')

function post (hubUrl, form) {
  let body = encode(form)
  let config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    }
  }

  return http.post(hubUrl, body, config)
  .then(request => {
    if (request.statusCode >= 400) throw request
    return request
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
