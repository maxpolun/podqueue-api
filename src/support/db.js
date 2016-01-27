'use strict'
let pg = require('pg')
let config = require('../config/config')

class PgClient {
  constructor (client) {
    this._client = client
    this.queryCount = 0
  }

  query (queryStr, params) {
    return new Promise((resolve, reject) => {
      let startTime = Date.now()
      this.queryCount++
      this._client.query(queryStr, params || [], (err, result) => {
        let timeDiff = Date.now() - startTime
        if (timeDiff >= config.longQueryTimeout) {
          let paramsStr = params ? `with params ${params}` : ''
          console.log('query took', timeDiff, 'ms. Query:', queryStr, paramsStr)
        }
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}

function connect (dbUrl) {
  return new Promise((resolve, reject) => {
    pg.connect(dbUrl, (err, client, done) => {
      if (err) return reject(err)
      resolve({client: new PgClient(client), done})
    })
  })
}

module.exports = connect
