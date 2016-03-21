var settings = require('./settings.json')
var db = require('./db').returnInstance()
var mailer = require('mailgun-js')(settings.mailgun)

module.exports = function (data, cb) {
  var text = JSON.stringify(data.value.body)
  var email = {
    from: data.value.body.email,
    to: 'hello@tableflip.io',
    subject: 'NEW StartUP! - ' + data.value.body['project-name'],
    text: text
  }
  mailer.messages().send(email, function (err, mailgunResponse) {
    if (err) return cb(err)
    db.del(data.key, cb)
  })
}
