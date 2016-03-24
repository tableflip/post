module.exports = function sendValues (db, keys, res) {
  var values = []
  db.createValueStream({
    gte: keys[0],
    lte: keys[1]
  })
  .on('data', function (data) { values.push(data) })
  .on('end', function () { res.json({ data: values }) })
  .on('error', function (err) {
    res.sendStatus(500)
    console.error('Error routes', err.message)
  })
}