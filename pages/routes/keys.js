// Domain & path get's you 2 keys, [domain+path, domain]
// Domain only get's you 1 key, [domain]
module.exports = function makeKeys (domain, path) {
  if (!domain) return ['route!', 'route!\xFF']
  var arr = [
    ['route!', domain, path].join(''),
    ['route!', domain].join('')
  ]
  if (!path || path === '/') arr.shift()
  return arr
}