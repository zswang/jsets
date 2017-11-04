
global.jsets = require('../')
      

describe("src/jsets.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("createGetter():base", function () {
    examplejs_printLines = [];
  let dict = { a: 1, b: 2, c: 3, 101: 5 }
  let food = {}
  food.get = jsets.createGetter(food, function(name) {
      return dict[name]
  })
  examplejs_print(JSON.stringify(food.get('a')))
  assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  examplejs_print(JSON.stringify(food.get(101)))
  assert.equal(examplejs_printLines.join("\n"), "5"); examplejs_printLines = [];
  food.get('a', function(a) {
    examplejs_print(JSON.stringify(a))
    assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  })
  food.get(function(c, b, a) {
    examplejs_print(JSON.stringify([a, b, c]))
    assert.equal(examplejs_printLines.join("\n"), "[1,2,3]"); examplejs_printLines = [];
  })
  food.get(['a', 'b'], function(a, b) {
      examplejs_print(JSON.stringify(a))
      assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
      examplejs_print(JSON.stringify(b))
      assert.equal(examplejs_printLines.join("\n"), "2"); examplejs_printLines = [];
  })
  examplejs_print(JSON.stringify(food.get(['a', 'b'])))
  assert.equal(examplejs_printLines.join("\n"), "{\"a\":1,\"b\":2}"); examplejs_printLines = [];
  });
          
  it("createSetter():base", function () {
    examplejs_printLines = [];
  let dict = {}
  let food = {}
  food.set = jsets.createSetter(food, function(name, value) {
    dict[name] = value
  })
  food.set('a', 1)
  examplejs_print(JSON.stringify(dict))
  assert.equal(examplejs_printLines.join("\n"), "{\"a\":1}"); examplejs_printLines = [];

  food.set({
    b: 2,
    c: 3
  })
  examplejs_print(JSON.stringify(dict))
  assert.equal(examplejs_printLines.join("\n"), "{\"a\":1,\"b\":2,\"c\":3}"); examplejs_printLines = [];
  });
          
});
         