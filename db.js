var crypto = require('crypto')
var levelup = require('levelup')
var db = levelup('./db', {valueEncoding: 'json'})

module.exports.save = function (req, done) {
  var kv = keyValue(req)
  db.put(kv.key, kv.value, (err, res) => {
    if (err) done(err)
    done(null, kv)
  })
}

module.exports.all = function (req, done) {
  var res = []
  db.createReadStream({
    'gte': 'msg!',
    'lte': 'msg!\xFF'
  })
  .on('error', done)
  .on('data', (data) => {
    res.push(data.value)
  })
  .on('close', () => {
    done(null, res)
  })
}

function keyValue (req) {
  var now = Date.now()
  var value = {
    body: req.body,
    headers: req.headers,
    createdAt: now
  }
  var hash = crypto.createHash('md5').update(JSON.stringify(value)).digest('hex')
  var key = ['msg', now, hash].join('!')
  return {key, value}
}
