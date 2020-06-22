'use strict'

const test = require('tape')
const assert = require('assert')

const CollapsedAssert = require('../index.js')

test('CollapsedAssert is a function', (t) => {
  t.equal(typeof CollapsedAssert, 'function')
  t.end()
})

test('use collapsed assert', (t) => {
  const cassert = new CollapsedAssert()

  for (let i = 0; i < 10; i++) {
    cassert.equal(i, i, 'expect same')
  }
  cassert.report(t, 'all pass')
  t.end()
})

test('use collapsed assert failing', (t) => {
  const cassert = new CollapsedAssert()

  for (let i = 0; i < 10; i++) {
    cassert.equal(i, i + 1, 'expect same')
  }
  t.throws(() => {
    cassert.report(assert, 'expect all fail')
  }, /expect all fail/)
  t.end()
})

test('use deepEqual', (t) => {
  const cassert = new CollapsedAssert()

  for (let i = 0; i < 10; i++) {
    cassert.deepEqual(i, i, 'expect same')
  }
  cassert.report(t, 'all pass')

  const cassert2 = new CollapsedAssert()

  for (let i = 0; i < 10; i++) {
    cassert2.deepEqual(i, i + 1, 'expect same')
  }
  t.throws(() => {
    cassert2.report(assert, 'expect all fail')
  }, /expect all fail/)

  t.end()
})
