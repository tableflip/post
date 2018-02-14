var url = require('url')
var makeKeys = require('./keys')
var sendValues = require('../../lib/send-values')

// Domain is required, path is optional.
module.exports = function (app, db) {

  // Create route
  app.post('/routes', function (req, res) {
    console.log('ROUTE!', '/routes', req.url)
    var referer = url.parse(req.fields.referer, true, true)
    var keys = makeKeys(referer.host, referer.path)
    var data = {
      email: req.fields.email,
      referer: req.fields.referer,
      redirect: req.fields.redirect,
      redirectError: req.fields.redirectError
    }
    db.put(keys[0], data, function (err) {
      if (err) {
        console.log('Error routes', err.message)
        return res.sendStatus(500)
      }
      res.redirect('back')
    })
  })

  // Retrieve routes
  app.get('/routes/json/:domain*', function (req, res) {
    var domain = req.params.domain
    var path = req.params[0]
    var keys = makeKeys(domain, path)
    sendValues(db, keys, res)
  })

  // Retrieve routes
  app.get('/routes/json', function (req, res) {
    sendValues(db, makeKeys(), res)
  })
}
