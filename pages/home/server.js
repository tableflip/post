var crypto = require('crypto')
var makeRouteKeys = require('../routes/keys')

module.exports = function (app, db) {
  app.post('/:domain*', (req, res) => {
    var domain = req.params.domain
    var path = req.params[0]
    var routeKeys = makeRouteKeys(domain, path)
    db.get(routeKeys[0], function (err, route) {
      if (err && err.notFound && routeKeys[1]) {
        db.get(routeKeys[1], function (err, route) {
          handleRoute(err, route, domain, path, req, res)
        })
      } else {
        handleRoute(err, route, domain, path, req, res)
      }
    })
  })

  function handleRoute (err, route, domain, path, req, res) {
    if (err && err.notfound) return res.sendStatus(404) // probably a duche. 404 them.
    if (err) return res.redirect('back') // don't die on this hill. Send them home.

    // we have a winner.
    var value = makeValue(req, domain, path)
    var key = makeKey(value)

    // TODO: ensure is a valid url
    var redirect = route.redirect.indexOf('http') === 0  ? route.redirect : req.headers.referer + route.redirect
    var redirectError = route.redirectError.indexOf('http') === 0  ? route.redirectError : req.headers.referer + route.redirectError

    db.put(key, value, (err, data) => {
      if (err) {
        return res.redirect(redirectError)
        console.error('Error home', err.message)
      }
      res.redirect(redirect)
    })
  }
}

function makeValue (req, domain, path) {
  var referer = path ? domain + path : domain
  return {
    body: req.body,
    referer: referer,
    headers: req.headers,
    createdAt: Date.now()
  }
}

function makeKey (value) {
  var hash = crypto.createHash('md5').update(JSON.stringify(value)).digest('hex')
  var key = ['msg', value.createdAt, hash].join('!')
  return key
}
