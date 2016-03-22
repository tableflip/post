var settings = require('../settings.json')
var mailer = require('mailgun-js')(settings.mailgun)
var jade = require('jade')
var fs = require('fs')
var path = require('path')
var async = require('async')

var Mail = function Mail (db) {
  if (!db) throw new Error('The mailer module needs an instance of the database')
  this.db = db
  this.mailer = mailer
}

Mail.prototype.send = function (data, domain, template, cb) {
  var self = this
  async.waterfall([
    (done) => {
      getEmailTpl(domain, template, done)
    },
    (tpl, done) => {
      parseEmailData(tpl, data, done)
    },
    (emailPayload, done) => {
      self.mailer.messages().send(emailPayload, done)
    }
  ], (err) => {
    if (err) throw new Error('email error')
    self.db.del(data.key, cb)
  })
}

function getEmailTpl (domain, template, cb) {
  var templateLocation = getTplLocation(domain, template)
  fs.readFile(templateLocation, function (err, tplBuffer) {
    if (err) return cb(err)
    var tpl = jade.compile(tplBuffer.toString(), {})
    cb(null, tpl)
  })
}

function parseEmailData (tpl, data, cb) {
  data.value.body.projectName = data.value.body['project-name']
  data.value.body.openSource = data.value.body['open-source']

  var body = tpl(data.value.body)

  var payload = {
    from: data.value.body.email,
    to: 'hello@tableflip.io',
    subject: 'NEW StartUP! - ' + data.value.body.projectName,
    html: body
  }

  cb(null, payload)
}

function getTplLocation (domain, template) {
  return path.normalize(path.join(__dirname, '..', 'emails/templates/' + domain + '/' + template + '.jade'))
}

module.exports = Mail
