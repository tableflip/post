var config = require('config')
var request = require('request')

// Called when a message is added to the db via `db.put`
// Runs a recpatcha check if there is a message and it has no `X-Spam-Flag` yet.
function spamCheck (db, fetchRecaptchaResult, key, value) {
  // Check if it's our turn to run
  if (value && value.headers && value.headers.hasOwnProperty('X-Spam-Flag')) return
  if (!value.key || !value.body || !value.headers) return
  // Site hasn't provide a `g-recaptcha-response` so is misconfigured or is spam
  if (!value.body['g-recaptcha-response']) {
    console.log('Missing `g-recaptcha-response` param on post from ' + key)
    return db.del(key)
  }

  fetchRecaptchaResult(value, function (err, isHuman) {
    if (err) return console.log('Failed to fetchRecaptchaResult for ' + key, err)
    if (isHuman) {
      value.headers['X-Spam-Flag'] = false
      delete value.body['g-recaptcha-response']
      db.put(key, value)
    } else {
      db.del(key)
    }
  })
}

// will call cb with (null, true) if value is from something more human than robot
function fetchRecaptchaResult (value, cb) {
  // if you know about post you can skip G recaptcha
  if (value.body['g-recaptcha-response'] === 'skip') return cb(null, true)
  // ask G if it's spam.
  request({
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    body: {
      secret: config.google.captcha[value.key],
      response: value.body['g-recaptcha-response'],
      remoteip: value.headers.remoteAddress
    }
  }, function (err, res, body) {
    if (err) return cb(err)
    const json = JSON.parse(body)
    return cb(err, json.success)
  })
}

module.exports = function (db) {
  db.on('put', spamCheck.bind(null, db, fetchRecaptchaResult))
}

// for testing
module.exports.spamCheck = spamCheck
module.exports.fetchRecaptchaResult = fetchRecaptchaResult
