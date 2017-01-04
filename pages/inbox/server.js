var sendValues = require('../../lib/send-values')

module.exports = function (app, db) {
  app.get('/inbox/json', function (req, res) {
    sendValues(db, makeKeys(), res)
  })
}

function makeKeys () {
  return ['msg!', 'msg!\xFF']
}
