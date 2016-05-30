'use strict'
let config = require('../config')
let koaCors = require('koa-cors')
let allowedOrigins = config.allowedOrigins
module.exports = koaCors({
  origin: req => allowedOrigins.indexOf(req.headers.origin) >= 0 && req.headers.origin
})
