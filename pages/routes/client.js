var list = require('./list')

module.exports = function (page) {
  page('/routes', enter)
}

function enter () {
  list('#list')
}