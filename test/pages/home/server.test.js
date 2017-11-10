const test = require('ava')
const makeRedirect = require('../../../pages/home/server').makeRedirect

test('Sensible redirects are chosen', t => {
  t.is(
    makeRedirect('?sent=ok', 'https://tableflip.io'),
    'https://tableflip.io/?sent=ok',
    'Queries are appended'
  )

  t.is(
    makeRedirect('sent-ok', 'https://tableflip.io/foo/contact-us'),
    'https://tableflip.io/foo/sent-ok',
    'path segments are resolved'
  )

  t.is(
    makeRedirect('sent-ok', 'https://tableflip.io/foo/contact-us/'),
    'https://tableflip.io/foo/contact-us/sent-ok',
    'and trailing slashes are a thing'
  )

  t.is(
    makeRedirect('../thanks', 'https://tableflip.io/foo/bar/contact-us'),
    'https://tableflip.io/foo/thanks',
    'traversals are traversed'
  )

  t.is(
    makeRedirect('./thanks', 'https://tableflip.io/foo/bar/contact-us'),
    'https://tableflip.io/foo/bar/thanks',
    'non traversals are non traversed'
  )

  t.is(
    makeRedirect('/thankingz', 'https://tableflip.io/oh/me/oh/my/contact-us'),
    'https://tableflip.io/thankingz',
    'Domain relatives are resolved'
  )

  t.is(
    makeRedirect('http://elsewhere.com', 'https://tableflip.io'),
    'http://elsewhere.com',
    'absolutes are returned absloutely'
  )
})
