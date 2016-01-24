'use strict'
let camelize = require('camelize')

class BaseModel {
  constructor (params) {
    Object.assign(this, camelize(params))
  }

  save (db) {
    return this.uuid ? this.update(db) : this.create(db)
  }
}

module.exports = BaseModel
