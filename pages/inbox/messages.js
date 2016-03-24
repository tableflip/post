var moment = require('moment')
var tpl = require('./messages.jade')

module.exports = function (query) {
  fetch('/inbox/json').then(function (res) {
    return res.json()
  }).then(function (res) {
    var data = res.data
    var messages = data.map(function (d) {
      var createdAt = moment(d.createdAt)
      var referer = d.headers.referer
      return {
        createdAt: createdAt.format('llll'),
        fromNow: createdAt.fromNow(),
        referer: referer,
        refererShort: referer.substring(referer.indexOf('//') + 2),
        body: d.body
      }
    })
    var html = tpl({
      messages: messages
    })
    document.querySelector(query).insertAdjacentHTML('beforeend', html)
  })
}