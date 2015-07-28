(function (exportName) {
  /*<remove>*/
  'use strict';
  /*</remove>*/

  /*<replace encoding="template" engine="ejs" data="../package.json">*/
  /**
   * @file <%- name %>
   *
   * <%- description %>
   * @author
       <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
   *   <%- item.name %> (<%- item.url %>)
       <% }); %>
   * @version <%- version %>
   */
  /*</replace>*/

  /* global exports */
  var exports = exports || {};

  /*<function name="createGetter" dependencies="camelCase">*/
  /**
   * 创建读取键值的方法
   *
   * @param {Object} target 目标对象
   * @param {Function} getter 读取一个键值函数
   *  getter -> function(name, fn)
   * @examples 获取属性的几种方式
      ```javascript
      var dict = { a: 1, b: 2, c: 3 };
      var food = {};
      food.get = jsets.createGetter(food, function(name) {
          return dict[name];
      });
      assert(get('a') === 1);
      assert(get('a', function(a) {
          assert(a === dict['a']);
      }) === food);
      assert(get(['a', 'b'], function(a, b) {
          assert(a === dict['a']);
          assert(b === dict['b']);
      }) === food);
      assert(JSON.stringify(get(['a', 'b'])) === JSON.stringify({a: 1, b: 2}));
      ```
   */
  function createGetter(target, getter, camel) {
    /*<safe>*/
    if (!getter) {
      throw new Error('createGetter() getter is undefined.');
    }
    /*</safe>*/
    var method = function (name, fn) {
      var result;

      var keys;
      if (typeof name === 'function') {
        keys = name['-jsets-params'];
        if (!keys) { // 优先从缓存中获取
          keys = [];
          String(name).replace(/\(\s*([^()]+?)\s*\)/,
            function (all, names) {
              keys = names.split(/\s*,\s*/);
            }
          );
          name['-jsets-params'] = keys;
        }
        return method(keys, name);
      }

      if (typeof name === 'string' || typeof name === 'number') {
        name = camel ? camelCase(name) : name;
        if (typeof fn === 'function') {
          fn.call(target, getter(name));
          return target;
        }
        return getter(name);
      }

      if (typeof name === 'object') {
        if (name instanceof Array) {
          if (typeof fn === 'function') {
            result = [];
            name.forEach(function (n) {
              result.push(getter(camel ? camelCase(n) : n));
            });
            fn.apply(target, result);
            return target;
          }
          result = {};
          name.forEach(function (n) {
            result[n] = getter(camel ? camelCase(n) : n);
          });
          return result;
        }

        var key;
        if (typeof fn === 'function') {
          result = [];
          for (key in name) {
            result.push(getter(camel ? camelCase(key) : key) || name[key]);
          }
          return target;
        }
        result = {};
        for (key in name) {
          result[key] = getter(camel ? camelCase(key) : key) || name[key];
        }
        return result;
      }
    };
    return method;
  }
  /*</function>*/
  exports.createGetter = createGetter;

  /*<function name="createSetter" dependencies="camelCase">*/
  /**
   * 创建设置键值的方法
   *
   * @param {Object} target 目标对象
   * @param {Function} setter 设置一个键值函数
   *  setter -> function(name, value)
   * @param {boolean} camel 键值是否需要驼峰化
   * @examples
      ```javascript
      var dict = {};
      var food = {};
      food.set = jsets.createSetter(food, function(name, value) {
          dict[name] = value;
      });

      food.set('a', 1);
      assert(JSON.stringify(dict) === JSON.stringify({a: 1}));
      food.set({
          b: 2,
          c: 3
      });
      assert(JSON.stringify(dict) === JSON.stringify({a: 1, b: 2, c: 3}));
      ```
   */
  function createSetter(target, setter, camel) {
    /*<safe>*/
    if (!setter) {
      throw new Error('createSetter() setter is undefined.');
    }
    /*</safe>*/
    return function (name, value) {
      if (typeof name === 'string' || typeof name === 'number') {
        setter(camel ? camelCase(name) : name, value);
      }
      else if (typeof name === 'object') {
        if (name instanceof Array) {
          name.forEach(function (n, i) {
            setter(i, n);
          });
        }
        else {
          for (var key in name) {
            setter(camel ? camelCase(key) : key, name[key]);
          }
        }
      }
      return target;
    };
  }
  /*</function>*/
  exports.createSetter = createSetter;

  /*<function name="camelCase">*/
  /**
   * 将目标字符串进行驼峰化处理
   *
   * @see https://github.com/BaiduFE/Tangram2/blob/master/src/baidu/string/toCamelCase.js
   * @param {string} text 传入字符串
   * @return {string} 驼峰化处理后的字符串
   */
  var camelCache = {}; // 缓存
  function camelCase(text) {
    if (!text || typeof text !== 'string') { // 非字符串直接返回
      return text;
    }
    var result = camelCache[text];
    if (result) {
      return result;
    }
    if (text.indexOf('-') < 0 && text.indexOf('_') < 0) {
      result = text;
    }
    else {
      result = text.replace(/[-_]+([a-z])/ig, function (all, letter) {
        return letter.toUpperCase();
      });
    }
    camelCache[text] = result;
    return result;
  }
  /*</function>*/
  exports.camelCase = camelCase;

  /* global define,module,window */
  /* exported exports */
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('jsets');