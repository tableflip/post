var levelup = require('levelup')
var db = levelup('./db', {valueEncoding: 'json'})

module.exports = db
