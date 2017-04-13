var config = require('config')
var request = require('request')

module.exports = function (db) {
  db.on('put', function (key, value) {
    if (value && value.headers && value.headers.hasOwnProperty('X-Spam-Flag')) return
    if (!value.key || !value.body || !value.headers) return
    request({
      method: 'POST',
      url: 'https://www.google.com/recaptcha/api/siteverify',
      json: true,
      body: {
        secret: config.google.captcha[value.key],
        response: value.body['g-recaptcha-response'],
        remoteip: value.headers.remoteAddress
      }
    }, function (err, result) {
      if (err) return console.error(err)
      value.headers['X-Spam-Flag'] = result.success
      db.put(key, value)
    })
  })
}
