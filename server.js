var express = require('express')
var bodyParser = require('body-parser')
var db = require('./db')
var mailer = require('./mailer')

var app = express()
app.enable('trust proxy')
app.disable('x-powered-by')

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', (req, res) => {
  db.save(req, (err, data) => {
    if (err) {
      console.error('in server.js db error', err)
      return res.redirect(req.headers.referer + '?sent=false')
    }
    mailer(data, function (err) {
      if (err) {
        console.error('in server.js mailer error', err)
        res.redirect(req.headers.referer + '?sent=false')
      }
      res.redirect(req.headers.referer + '?sent=true')
    })
  })
})

app.get('/list', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  db.all(req, (err, data) => {
    if (err) res.end(JSON.stringify(err, null, 2))
    res.end(JSON.stringify(data, null, 2))
  })
})

app.use(express.static('dist'))

app.listen(1337, '127.0.0.1', () => {
  console.log('Running')
})
