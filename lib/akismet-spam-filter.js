var akismet = require('akismet-api')
var apiKey = require('config').akismet.apiKey

module.exports = {
  'tableflip.io': akismet.client({ key: apiKey, blog: 'https://tableflip.io' }),
  'brandnewweddings.co.uk': akismet.client({ key: apiKey, blog: 'https://brandnewweddings.co.uk' })
}
