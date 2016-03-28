var tpl = require('./list.jade')

module.exports = function (query) {
  fetch('/routes/json').then(function (res) {
    return res.json()
  }).then(function (res) {
    var data = res.data.map(function (d) {
      d.refererShort = d.referer.substring(d.referer.indexOf('//') + 2)
      return d
    })
    var html = tpl({data: data})
    document
      .querySelector(query)
      .insertAdjacentHTML('beforeend', html)
  })
}
