var db = require('./db')
// var Mail = require('./emails/mailer')
// var mailer = new Mail(db)
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.enable('trust proxy')
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))

var routes = [
  require('./pages/routes/server.js'),
  require('./pages/inbox/server.js'),
  require('./pages/home/server.js')
]

routes.forEach(function (route) {
  route(app, db)
})

app.use(express.static('dist'))

app.listen(1337, '127.0.0.1', () => {
  console.log('Running')
})
