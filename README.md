[![Build Status](https://travis-ci.org/kaelzhang/script-ready.svg?branch=master)](https://travis-ci.org/kaelzhang/script-ready)
<!-- [![Coverage](https://codecov.io/gh/kaelzhang/script-ready/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/script-ready) -->
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/script-ready?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/script-ready)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/script-ready.svg)](http://badge.fury.io/js/script-ready)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/script-ready.svg)](https://www.npmjs.org/package/script-ready)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/script-ready.svg)](https://david-dm.org/kaelzhang/script-ready)
-->

# script-ready

Detect or wait for if a script node is ready

## Install

```sh
$ npm i script-ready
```

## Usage

```js
import {
  // Check if the given script is ready
  is,
  // Wait until the script is ready
  when
} from 'script-ready'

is('a.js')  // true

when('b.js').then(node => {
  // The `HTMLScriptElement` node of the script
  console.log(node)
})
```

## License

[MIT](LICENSE)
