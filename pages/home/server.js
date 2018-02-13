var url = require('url')
var crypto = require('crypto')
var makeRouteKeys = require('../routes/keys')

module.exports = function (app, db) {
  // Store messages that we recieve as posts, if we find a matching route
  app.post('/:domain*', (req, res) => {
    var domain = req.params.domain
    var path = req.params[0]
    var noRedirect = req.query && req.query.noRedirect === "true"

    var respond = function (statusCode, route, referer) {
      if (noRedirect || statusCode === 404) {
        // no route configured, domain or route specifc.
        return res.status(statusCode).end()
      }
      if (statusCode === 500) {
        // Misc fail. Send them home.
        return res.redirect('back')
      }
      if (statusCode === 403) {
        // Route found, but no can do
        res.redirect(makeRedirect(route.redirectError, referer))
      }
      if (statusCode === 200) {
        // Winner
        res.redirect(makeRedirect(route.redirect, referer))
      }
    }

    findRoute(domain, path, (err, route) => {
      if (err && err.notfound) return respond(404)
      if (err) return respond(500)

      // we have a winner. Store the msg.
      var value = makeValue(req, domain, path, route)
      var key = makeKey(value)
      var referer = req.headers.referer

      db.put(key, value, (err, data) => {
        if (err) {
          console.error('Failed to save message', key, value, err.message)
          return respond(403, route, referer)
        }
        respond(200, route, referer)
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

// Return url if absolute. Otherwise `resolve` the url aginst the referer.
function makeRedirect (redirectUrl, referer) {
  // We only support http(s) at the moment.
  if (redirectUrl.indexOf('http') === 0) return redirectUrl
  return url.resolve(referer, redirectUrl)
}

function makeValue (req, domain, path, route) {
  return {
    key: path ? domain + path : domain,
    body: req.body,
    headers: {
      referer: req.headers.referer,
      remoteAddress: req.connection.remoteAddress,
      'user-agent': req.headers['user-agent']
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

// For testing
module.exports.makeRedirect = makeRedirect