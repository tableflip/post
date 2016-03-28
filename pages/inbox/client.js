var messages = require('./messages')

module.exports = function (page) {
  page('/inbox', function () {
    messages('#messages')
  })
}
