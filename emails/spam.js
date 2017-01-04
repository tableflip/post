var config = require('config')
var akismet = require('akismet-api')

module.exports = function (db) {
  db.on('put', function (key, value) {
    if (value.headers['X-Spam-Flag']) return

    var client = akismet.client({
      key: config.akismet.apiKey,
      blog: 'http://' + value.key
    })

    client.checkSpam({
      user_ip: value.headers['user-ip'],
      user_agent: value.headers['user-agent'],
      referrer: value.key
    }, function (err, spam) {
      if (err) return console.error(err)
      value.headers['X-Spam-Flag'] = spam ? 'YES' : 'NO'
      db.put(key, value)
    })
  })
}
