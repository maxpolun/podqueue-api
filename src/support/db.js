'use strict'
let pg = require('pg')

function connect (dbUrl) {
  return new Promise((resolve, reject) => {
    pg.connect(dbUrl, (err, client, done) => {
      if (err) return reject(err)
      resolve({
        client: {
          query: (queryStr, params) => new Promise((resolve, reject) => {
            client.query(queryStr, params || [], (err, result) => {
              if (err) return reject(err)
              resolve(result)
            })
          })
        },
        done
      })
    })
  })
}

module.exports = connect
