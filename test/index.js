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

test('all assertions', (t) => {
  const cassert = new CollapsedAssert()

  cassert.ifError(null)
  cassert.equal('hi', 'hi')
  cassert.notEqual('foo', 'bar')
  cassert.ok('hi')
  // cassert.fail()
  cassert.deepEqual({ foo: 'bar' }, { foo: 'bar' })
  cassert.deepStrictEqual({ foo: 'b' }, { foo: 'b' })
  cassert.doesNotMatch('foo', /bar/)
  cassert.doesNotThrow(() => {})
  cassert.match('foo', /foo/)
  cassert.notDeepEqual({ foo: 'a' }, { foo: 'b' })
  cassert.notDeepStrictEqual({ foo: 'a' }, { foo: 'b' })
  cassert.notStrictEqual('a', 'b')
  cassert.strictEqual('a', 'a')
  cassert.throws(() => { throw new Error('o') })

  cassert.report(t, 'all pass')
  t.end()
})

test('all assertions fail', (t) => {
  t.ok(checkFailure((cassert) => {
    cassert.ifError(new Error('fail'))
  }))
  t.ok(checkFailure((cassert) => {
    cassert.equal('hi', 'bye')
  }))
  t.ok(checkFailure((cassert) => {
    cassert.notEqual('foo', 'foo')
  }))
  t.ok(checkFailure((cassert) => {
    cassert.ok(false)
  }))
  t.ok(checkFailure((cassert) => {
    cassert.fail()
  }))
  t.ok(checkFailure((cassert) => {
    cassert.deepEqual({ foo: 'bar' }, { foo: 'bar2' })
  }))
  t.ok(checkFailure((cassert) => {
    cassert.deepStrictEqual({ foo: 'b2' }, { foo: 'b' })
  }))
  t.ok(checkFailure((cassert) => {
    cassert.doesNotMatch('foo', /foo/)
  }))
  t.ok(checkFailure((cassert) => {
    cassert.doesNotThrow(() => { throw new Error('fail') })
  }))
  t.ok(checkFailure((cassert) => {
    cassert.match('foo', /bar/)
  }))
  t.ok(checkFailure((cassert) => {
    cassert.notDeepEqual({ foo: 'a' }, { foo: 'a' })
  }))
  t.ok(checkFailure((cassert) => {
    cassert.notDeepStrictEqual({ foo: 'a' }, { foo: 'a' })
  }))
  t.ok(checkFailure((cassert) => {
    cassert.notStrictEqual('a', 'a')
  }))
  t.ok(checkFailure((cassert) => {
    cassert.strictEqual('a', 'b')
  }))
  t.ok(checkFailure((cassert) => {
    cassert.throws(() => {})
  }))

  t.end()
})

/**
 * @param {(c: CollapsedAssert) => void} fn
 * @returns {boolean}
 */
function checkFailure (fn) {
  const cassert = new CollapsedAssert()

  fn(cassert)

  const reportAssert = new CollapsedAssert()
  cassert.report(reportAssert, 'should fail')

  return reportAssert._commands.length === 2 &&
    reportAssert._commands[0][0] === 'ok' &&
    reportAssert._commands[0][1] === false &&
    reportAssert._commands[0][2] === 'should fail'
}
