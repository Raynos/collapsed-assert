'use strict'

var test = require('tape')

var collapsedAssert = require('../index.js')

test('collapsedAssert is a function', function t (assert) {
  assert.equal(typeof collapsedAssert, 'function')
  assert.end()
})
