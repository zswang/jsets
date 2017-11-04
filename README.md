jsets
-----------

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

> Define Getter and Setter

## Install 安装

```sh
$ npm install --save jsets
```

## Usage 使用

```js
const jsets = require('jsets')

let data = {}
let instance = {}
instance.set = jsets.createSetter(instance, function (name, value) {
  data[name] = value
}, true)
instance.get = jsets.createGetter(instance, function (name, value) {
  return data[name]
}, true)

instance.set('a', 1)
instance.set({
  a: 1,
  b: 2
})
instance.get(function (b, a) {
  console.log(b, a) // 2, 1
})
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/jsets
[npm-image]: https://badge.fury.io/js/jsets.svg
[travis-url]: https://travis-ci.org/zswang/jsets
[travis-image]: https://travis-ci.org/zswang/jsets.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/jsets?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/jsets/badge.svg?branch=master&service=github