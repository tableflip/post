var settings = require('./settings.json')
var mailer = require('mailgun-js')(settings.mailgun)

var Mail = function Mail (db) {
  if (!db) throw new Error('The mailer module needs an instance of the database')
  this.db = db
  this.mailer = mailer
}

Mail.prototype.send = function (data, cb) {
  var self = this
  // body will be an email template
  var body = JSON.stringify(data.value.body)
  var email = {
    from: data.value.body.email,
    to: 'bernard@tableflip.io',
    subject: 'NEW StartUP! - ' + data.value.body['project-name'],
    text: body
  }
  self.mailer.messages().send(email, function (err, mailgunResponse) {
    if (err) return cb(err)
    self.db.del(data.key, cb)
  })
}

module.exports = Mail
