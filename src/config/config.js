'use strict'
let env = process.env.NODE_ENV || 'development'

module.exports = {
  env: env,
  port: process.env.PORT || 4000,
  dbUrl: process.env.DATABASE_URL || 'postgres://podqueue@localhost/podqueue-dev',
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  verboseLogging: process.env.USE_VERBOSE_LOGGING === 'true' || env === 'development',
  longQueryTimeout: process.env.LONG_QUERY_TIMEOUT || (env === 'development' ? 50 : 500),
  logRequests: process.env.LOG_ALL_REQUESTS === 'true' || env !== 'test',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')
                                              : ['http://localhost:4040']
}
