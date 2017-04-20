const test = require('ava')
const spamCheck = require('../../emails/spam').spamCheck

test.cb('spam is deleted', t => {
  const message = {
    key: 'teskey',
    headers: {
    },
    body: {
      'g-recaptcha-response': 'foobar'
    }
  }
  const db = {
    del: function (key) {
      t.is(key, message.key)
      t.end()
    },
    put: function (key, value) {
      t.fail()
    }
  }
  const fetchRecaptchaResult = (value, cb) => {
    cb(null, false)
  }
  spamCheck(db, fetchRecaptchaResult, message.key, message)
})

test.cb('no g-recaptcha-response is deleted', t => {
  const message = {
    key: 'teskey',
    headers: {
    },
    body: {
      'spamlike': 'very much'
    }
  }
  const db = {
    del: function (key) {
      t.is(key, message.key)
      t.end()
    },
    put: function (key, value) {
      t.fail()
    }
  }
  const fetchRecaptchaResult = (value, cb) => {
    t.fail()
  }
  spamCheck(db, fetchRecaptchaResult, message.key, message)
})

test.cb('ham is preserved', t => {
  const message = {
    key: 'teskey',
    headers: {
    },
    body: {
      'g-recaptcha-response': 'foobar'
    }
  }
  const db = {
    del: function () {
      t.fail()
    },
    put: function (key, value) {
      t.is(value.headers['X-Spam-Flag'], false, 'Set X-Spam-Flag')
      t.falsy(value.body['g-recaptcha-response'], 'Removed g-recaptcha-response param')
      t.end()
    }
  }
  const fetchRecaptchaResult = (value, cb) => {
    cb(null, true)
  }
  spamCheck(db, fetchRecaptchaResult, message.key, message)
})
