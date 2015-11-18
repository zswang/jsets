var assert = require('should');
var jsets = require('../.');
var util = require('util');
var printValue;
function print(value) {
  if (typeof printValue !== 'undefined') {
    throw new Error('Test case does not match.');
  }
  printValue = value;
}
describe("./src/jsets.js", function () {
  printValue = undefined;
  it("createGetter():base", function () {
    var dict = { a: 1, b: 2, c: 3 };
    var food = {};
    food.get = jsets.createGetter(food, function(name) {
        return dict[name];
    });
    print(JSON.stringify(food.get('a')));
    assert.equal(printValue, "1"); printValue = undefined;
    food.get('a', function(a) {
      print(JSON.stringify(a));
      assert.equal(printValue, "1"); printValue = undefined;
    });
    food.get(function(c, b, a) {
      print(JSON.stringify([a, b, c]));
      assert.equal(printValue, "[1,2,3]"); printValue = undefined;
    });
    food.get(['a', 'b'], function(a, b) {
        print(JSON.stringify(a));
        assert.equal(printValue, "1"); printValue = undefined;
        print(JSON.stringify(b));
        assert.equal(printValue, "2"); printValue = undefined;
    });
    print(JSON.stringify(food.get(['a', 'b'])));
    assert.equal(printValue, "{\"a\":1,\"b\":2}"); printValue = undefined;
  });
  it("createSetter():base", function () {
    var dict = {};
    var food = {};
    food.set = jsets.createSetter(food, function(name, value) {
      dict[name] = value;
    });
    food.set('a', 1);
    print(JSON.stringify(dict));
    assert.equal(printValue, "{\"a\":1}"); printValue = undefined;
    food.set({
      b: 2,
      c: 3
    });
    print(JSON.stringify(dict));
    assert.equal(printValue, "{\"a\":1,\"b\":2,\"c\":3}"); printValue = undefined;
  });
  it("camelCase():base", function () {
    print(jsets.camelCase('do-ready'));
    assert.equal(printValue, "doReady"); printValue = undefined;
    print(jsets.camelCase('on-status-change'));
    assert.equal(printValue, "onStatusChange"); printValue = undefined;
    print(jsets.camelCase('on-statusChange'));
    assert.equal(printValue, "onStatusChange"); printValue = undefined;
  });
});
