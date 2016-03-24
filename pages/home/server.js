var crypto = require('crypto')
var makeRouteKeys = require('../routes/keys')

module.exports = function (app, db) {

  // Store messages that we recieve as posts, if we find a matching route
  app.post('/:domain*', (req, res) => {
    var domain = req.params.domain
    var path = req.params[0]

    findRoute(domain, path, (err, route) => {
      if (err && err.notfound) return res.sendStatus(404) // no route configured, domain or route specifc.
      if (err) return res.redirect('back') // Misc fail. Send them home.

      // we have a winner. Store the msg.
      var value = makeValue(req, domain, path, route)
      var key = makeKey(value)
      var referer = req.headers.referer

      db.put(key, value, (err, data) => {
        if (err) {
          console.error('Failed to save message', key, value, err.message)
          return res.redirect(makeRedirect(route.redirectError, referer))
        }
        res.redirect(makeRedirect(route.redirect, referer))
      })
    })
  })

  // Look up route for domain + path. Fallback to domain route if not found.
  function findRoute (domain, path, done) {
    var routeKeys = makeRouteKeys(domain, path)
    db.get(routeKeys[0], (err, route) => {
      if (err && err.notFound && routeKeys[1]) {
        db.get(routeKeys[1], done)
      } else {
        done(err, route)
      }
    })
  }
}

// Return url if absolute. Append url to referer if not.
function makeRedirect (url, referer) {
  return url.indexOf('http') === 0  ? url : referer + url
}

function makeValue (req, domain, path, route) {
  return {
    key: path ? domain + path : domain,
    body: req.body,
    headers: {
      referer: req.headers.referer,
      'user-agent': req.headers.userAgent
    },
    route: route,
    createdAt: Date.now()
  }
}

// timestamp for sorting, hash for uniqueness
function makeKey (value) {
  var hash = crypto.createHash('md5').update(JSON.stringify(value.body)).digest('hex')
  var key = ['msg', value.createdAt, hash].join('!')
  return key
}
