'use strict'
module.exports = function pubsubListener (router) {
  router.get('/subscriptions/:podcastUuid', function * () {
    this.body = this.query['hub.challenge']
  })

  router.post('/subscriptions/:podcastUuid', function * () {
    // update podcast
    this.body = ''
  })
}
