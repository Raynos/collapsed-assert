# collapsed-assert

<!--
    [![build status][build-png]][build]
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

collapse TAP assert statements into a single line

## Example

```js
var CollapsedAssert = require("collapsed-assert");

/*  Use this when you want to do unit test assertions on
    large arrays or assertions for EVERY test before/after.

    This will stop `tape` printing one hundred lines of
    `ok N should be equal` and allows you to collapse that into
    a single line.

    If any of the assertions fails it will pass through all
    success & failures raw to the underlying `t`, but if they
    all succeed it's collapsed into a single

    `ok N should be ok`
*/
var cassert = new CollapsedAssert()
for (const item of items) {
  cassert.equal(item.foo, 'foo')
}
cassert.report(t, 'all items are good')
```

// TODO. State what the module does.

## Installation

`npm install collapsed-assert`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licensed

  [build-png]: https://secure.travis-ci.org/Raynos/collapsed-assert.png
  [build]: https://travis-ci.org/Raynos/collapsed-assert
  [cover-png]: https://coveralls.io/repos/Raynos/collapsed-assert/badge.png
  [cover]: https://coveralls.io/r/Raynos/collapsed-assert
  [dep-png]: https://david-dm.org/Raynos/collapsed-assert.png
  [dep]: https://david-dm.org/Raynos/collapsed-assert
  [npm-png]: https://nodei.co/npm/collapsed-assert.png?stars&downloads
  [npm]: https://nodei.co/npm/collapsed-assert
