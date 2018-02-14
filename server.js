var start = Date.now()
var db = require('./db')
var mailer = require('./emails/mailer.js')(db)
var spam = require('./emails/spam.js')(db)
var config = require('config')
var corser = require('corser')
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var formidable = require('express-formidable')

var app = express()
app.enable('trust proxy')
app.disable('x-powered-by')
app.use(morgan('short'))
app.use(corser.create())
app.use(express.static('dist'))
app.use(formidable())

var routes = [
  require('./pages/routes/server.js'),
  require('./pages/inbox/server.js'),
  require('./pages/home/server.js')
].forEach(function (route) {
  route(app, db)
})

app.listen(config.port, '127.0.0.1', () => {
  console.log('P O S T ≈ http://localhost:%s ≈ started in %sms', config.port, Date.now() - start)
})
