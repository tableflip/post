var async = require('async')
var config = require('config')
var mailgun = require('mailgun-js')(config.mailgun)
var jade = require('jade')
var emailTpl = jade.compileFile(__dirname + '/email.jade')

module.exports = function init (db) {
  if (!db) throw new Error('The mailer module needs an instance of the database')

  // Send emails after a put. TODO: throttle and batch / digest.
  db.on('put', (key, value) => {
    if (key.indexOf('msg!') !== 0) return
    if (!value.route) return
    if (!value.route.email) return
    setImmediate(() => {
      sendEmail(value, (err) => {
        if (err) return console.error('Error sending email', err)
        db.del(key, (err) => {
          if (err) return console.error('Email sent, but failed to remove msg', data.key, err)
        })
      })
    })
  })
}

function sendEmail (message, done) {
  var data = {
    to: message.route.email,
    from: 'TABLEFLIP <post@tableflip.io>',
    subject: message.body.subject || '[POST] Message from ' + message.key,
    html: emailTpl(message)
  }
  // Fire!
  mailgun.messages().send(data, done)
}
