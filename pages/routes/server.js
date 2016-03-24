var url = require('url')
var makeKeys = require('./keys')
var sendValues = require('../../lib/send-values')

// Domain is required, path is optional.
module.exports = function (app, db) {

  // Create route
  app.post('/routes', function (req, res) {
    var referer = url.parse(req.body.referer, true, true)
    var keys = makeKeys(referer.host, referer.path)
    var data = {
      email: req.body.email,
      referer: req.body.referer,
      redirect: req.body.redirect,
      redirectError: req.body.redirectError
    }
    db.put(keys[0], data, function (err) {
      if (err) {
        res.sendStatus(500)
        console.error('Error routes', err.message)
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


