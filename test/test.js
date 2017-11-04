const assert = require('should')
const jsets = require('../.')

describe('camelCase: false', function () {
  var data = {}
  var instance = {}
  instance.set = jsets.createSetter(instance, function (name, value) {
    data[name] = value
  })
  instance.get = jsets.createGetter(instance, function (name, value) {
    return data[name]
  })
  instance.set()
  instance.get()


  it("instance.set('a', 1)", function () {
    instance.set('a', 1)
    assert.equal(data['a'], 1)
  })
  it("instance.set({b: 2, c: 3})", function () {
    instance.set({
      b: 2,
      c: 3
    })
    assert.equal(data['b'], 2)
    assert.equal(data['c'], 3)
  })
  it("instance.set('d', 4).set('e', 5)", function () {
    instance.set('d', 4).set('e', 5)
    assert.equal(data['d'], 4)
    assert.equal(data['e'], 5)
  })

  it("instance.get('a')", function () {
    assert.equal(instance.get('a'), data['a'])
  })
  it("instance.get(['a', 'b'])", function () {
    var r = instance.get(['a', 'b'])
    assert.equal(r['a'], data['a'])
    assert.equal(r['b'], data['b'])
  })
  it("instance.get(['a', 'b'], function(a, b) { ... })", function () {
    instance.get(['a', 'b'], function (a, b) {
      assert.equal(a, data['a'])
      assert.equal(b, data['b'])
    })
  })
  it("instance.get(function(a, b) { ... })", function () {
    instance.get(function (a, b) {
      assert.equal(a, data['a'])
      assert.equal(b, data['b'])
    }).get(function (c, d) {
      assert.equal(c, data['c'])
      assert.equal(d, data['d'])
    })
    function getABC(a, b, c) {
      assert.equal(a, data['a'])
      assert.equal(b, data['b'])
      assert.equal(c, data['c'])
    }
    instance.get(getABC)
    instance.get(getABC)
  })

  it("instance.get({a: 2, e: 6})", function () {
    var r = instance.get({ a: 2, z: 26 })
    assert.equal(r['a'], 1)
    assert.equal(r['z'], 26) // default
  })

  it("instance.get('a', function(a) { ... })", function () {
    instance.get('a', function (a) {
      assert.equal(data['a'], a)
    })
  })

  it("instance.get({a: 2, e: 6}, function() { ... })", function () {
    instance.get({ a: 2, z: 26 }, function (r) {
      assert.equal(r['a'], 1)
      assert.equal(r['z'], 26)
    })
  })

  it("instance.set('a-name', 'a1')", function () {
    instance.set('a-name', 'a1')
    assert.notEqual(instance.get('a-name'), instance.get('aName'))
  })
  it("instance.set({ab: 'a-2', cd: '3-4'})", function () {
    instance.set({
      ab: 'a-b',
      cd: 'c-d'
    })
    assert.equal(data['ab'], 'a-b')
    assert.equal(data['cd'], 'c-d')
  })

  it("instance.set(['a', 'b', 'c'])", function () {
    instance.set(['a', 'b', 'c'])
    assert.equal(instance.get(0), 'a')
    assert.equal(instance.get(1), 'b')
    assert.equal(instance.get(2), 'c')
  })
})

describe('camelCase: true', function () {
  var data = {}
  var instance = {}
  instance.set = jsets.createSetter(instance, function (name, value) {
    data[name] = value
  }, true)
  instance.get = jsets.createGetter(instance, function (name, value) {
    return data[name]
  }, true)

  it("instance.set('a', 1)", function () {
    instance.set('a', 1)
    assert.equal(data['a'], 1)
  })
  it("instance.set(101, 5)", function () {
    instance.set(101, 5)
    assert.equal(data[101], 5)
  })
  it("instance.set({b: 2, c: 3})", function () {
    instance.set({
      b: 2,
      c: 3
    })
    assert.equal(data['b'], 2)
    assert.equal(data['c'], 3)
  })
  it("instance.set('d', 4).set('e', 5)", function () {
    instance.set('d', 4).set('e', 5)
    assert.equal(data['d'], 4)
    assert.equal(data['e'], 5)
  })

  it("instance.get('a')", function () {
    assert.equal(instance.get('a'), data['a'])
  })
  it("instance.get(['a', 'b'])", function () {
    var r = instance.get(['a', 'b'])
    assert.equal(r['a'], data['a'])
    assert.equal(r['b'], data['b'])
  })
  it("instance.get(['a', 'b'], function(a, b) { ... })", function () {
    instance.get(['a', 'b'], function (a, b) {
      assert.equal(a, data['a'])
      assert.equal(b, data['b'])
    })
  })
  it("instance.get(function(a, b) { ... })", function () {
    instance.get(function (a, b) {
      assert.equal(a, data['a'])
      assert.equal(b, data['b'])
    }).get(function (c, d) {
      assert.equal(c, data['c'])
      assert.equal(d, data['d'])
    })
    function getABC(a, b, c) {
      assert.equal(a, data['a'])
      assert.equal(b, data['b'])
      assert.equal(c, data['c'])
    }
    instance.get(getABC)
    instance.get(getABC)
  })

  it("instance.get({a: 2, e: 6})", function () {
    var r = instance.get({ a: 2, z: 26 })
    assert.equal(r['a'], 1)
    assert.equal(r['z'], 26) // default
  })

  it("instance.get('a', function(a) { ... })", function () {
    instance.get('a', function (a) {
      assert.equal(data['a'], a)
    })
  })

  it("instance.get({a: 2, e: 6}, function() { ... })", function () {
    instance.get({ a: 2, z: 26 }, function (r) {
      assert.equal(r['a'], 1)
      assert.equal(r['z'], 26)
    })
  })

  it("instance.set('a-name', 'a1')", function () {
    instance.set('a-name', 'a1')
    assert.equal(instance.get('a-name'), instance.get('aName'))
  })
  it("instance.set('HHead', 'a1')", function () {
    instance.set('HHead', 'a1')
    assert.equal(instance.get('HHead'), instance.get('hHead'))
  })
  it("instance.set({ab: 'a-2', cd: '3-4'})", function () {
    instance.set({
      ab: 'a-b',
      cd: 'c-d'
    })
    assert.equal(data['ab'], 'a-b')
    assert.equal(data['cd'], 'c-d')
  })

  it("instance.set(['a', 'b', 'c'])", function () {
    instance.set(['a', 'b', 'c'])
    assert.equal(instance.get(0), 'a')
    assert.equal(instance.get(1), 'b')
    assert.equal(instance.get(2), 'c')
  })
})
