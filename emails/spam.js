var config = require('config')
var akismet = require('akismet-api')

module.exports = function (db) {
  db.on('put', function (key, value) {
    if (value.headers.hasOwnProperty('X-Spam-Flag')) return

    var client = akismet.client({
      key: config.akismet.apiKey,
      blog: 'http://' + value.key.split('/')[0]
    })

    // the spelling of referrer is 'correct' here
    client.checkSpam({
      user_ip: value.headers.remoteAddress,
      user_agent: value.headers['user-agent'],
      referrer: value.headers.referer
    }, function (err, spam) {
      if (err) return console.error(err)
      value.headers['X-Spam-Flag'] = spam
      db.put(key, value)
    })
  })
}
