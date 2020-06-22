// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict'

var nodeAssert = require('assert')
var KNOWN_ERROR = new Error('known')

module.exports = CollapsedAssert

function CollapsedAssert () {
  if (!(this instanceof CollapsedAssert)) {
    return new CollapsedAssert()
  }

  this._consumed = false
  this._commands = []
  this._failed = false
}

CollapsedAssert.prototype.hasFailed =
function hasFailed () {
  return this._failed
}

CollapsedAssert.prototype._check =
function _check (fail, cmd) {
  if (this._consumed) {
    throw new Error('collapsed assert ' + cmd[0] + ' after consumption')
  }
  if (fail) {
    this._failed = true
  }
  this._commands.push(cmd)
}

CollapsedAssert.prototype.ifError = function ifError (err, msg, extra) {
  this._check(err, ['ifError', err, msg, extra])
}

CollapsedAssert.prototype.equal = function equal (a, b, msg, extra) {
  this._check(a !== b, ['equal', a, b, msg, extra])
}

CollapsedAssert.prototype.notEqual = function notEqual (a, b, msg, extra) {
  this._check(a === b, ['notEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.ok = function ok (bool, msg, extra) {
  this._check(!bool, ['ok', bool, msg, extra])
}

CollapsedAssert.prototype.fail = function fail (msg, extra) {
  this._check(true, ['fail', msg, extra])
}

CollapsedAssert.prototype.deepEqual =
function deepEqual (a, b, msg, extra) {
  this._check(!tryAssert(function _tryDeepEqual () {
    // eslint-disable-next-line node/no-deprecated-api
    nodeAssert.deepEqual(a, b, KNOWN_ERROR)
  }), ['deepEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.deepStrictEqual =
function deepStrictEqual (a, b, msg, extra) {
  this._check(!tryAssert(function _tryDeepStrictEqual () {
    nodeAssert.deepStrictEqual(a, b, KNOWN_ERROR)
  }), ['deepStrictEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.doesNotMatch =
function doesNotMatch (string, regexp, msg, extra) {
  this._check(
    string.match(regexp),
    ['doesNotMatch', string, regexp, msg, extra]
  )
}

CollapsedAssert.prototype.doesNotThrow =
function doesNotThrow (fn, expected, msg, extra) {
  this._check(!tryAssert(function _tryDoesNotThrow () {
    try {
      nodeAssert.doesNotThrow(fn, expected, msg)
    } catch (_) {
      throw KNOWN_ERROR
    }
  }), ['doesNotThrow', fn, expected, msg, extra])
}

CollapsedAssert.prototype.match =
function match (string, regexp, msg, extra) {
  this._check(!string.match(regexp),
    ['match', string, regexp, msg, extra]
  )
}

CollapsedAssert.prototype.notDeepEqual =
function notDeepEqual (a, b, msg, extra) {
  this._check(!tryAssert(function _tryNotDeepEqual () {
    // eslint-disable-next-line node/no-deprecated-api
    nodeAssert.notDeepEqual(a, b, KNOWN_ERROR)
  }), ['notDeepEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.notDeepStrictEqual =
function notDeepStrictEqual (a, b, msg, extra) {
  this._check(!tryAssert(function _tryNotDeepStrictEqual () {
    nodeAssert.notDeepStrictEqual(a, b, KNOWN_ERROR)
  }), ['notDeepStrictEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.notStrictEqual =
function notStrictEqual (a, b, msg, extra) {
  this._check(a === b, ['notStrictEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.strictEqual =
function strictEqual (a, b, msg, extra) {
  this._check(a !== b, ['strictEqual', a, b, msg, extra])
}

CollapsedAssert.prototype.throws =
function throws (fn, expected, msg, extra) {
  this._check(!tryAssert(function _tryThrows () {
    try {
      nodeAssert.throws(fn, expected, msg)
    } catch (_) {
      throw KNOWN_ERROR
    }
  }), ['throws', fn, expected, msg, extra])
}

CollapsedAssert.prototype.report = function report (realAssert, message) {
  nodeAssert(message, 'must pass message')
  realAssert.ok(!this._failed, message)
  if (this._failed) {
    this.passthru(realAssert)
  } else {
    this._consumed = true
  }
}

CollapsedAssert.prototype.passthru = function passthru (realAssert) {
  for (var i = 0; i < this._commands.length; i++) {
    var command = this._commands[i]

    var method = command.shift()
    realAssert[method].apply(realAssert, command)
  }
  this._consumed = true
}

CollapsedAssert.prototype.comment =
function comment (msg) {
  this._commands.push(['comment', msg])
}

// Try the fn, if it doesnt fail the assertion then pass
// If it throws the KNOWN_ERROR then false, otherwise rethrow
function tryAssert (fn) {
  try {
    fn()
    return true
  } catch (err) {
    if (err === KNOWN_ERROR) return false
    throw err
  }
}
