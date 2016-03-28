var levelup = require('levelup')
var db = levelup('./db', {valueEncoding: 'json'})

db.on('put', (key, value) => { console.log('db PUT:', key) })
db.on('del', (key, value) => { console.log('db DEL:', key) })

module.exports = db
