var page = require('page')

var routes = [
  require('./home/client.js'),
  require('./inbox/client.js'),
  require('./routes/client.js'),
]

routes.forEach(function (route) {
  route(page)
})

page({
  click: false
})