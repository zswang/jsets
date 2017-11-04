(function (root, factory) {
    /* istanbul ignore next */
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    } else { factory(null, root["jsets"] = {}); }
})(this, function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @file jsets
     * @url
     * Define Getter and Setter
     * @author
     *   zswang (http://weibo.com/zswang)
     * @version 1.0.1
     * @date 2017-11-04
     * @license MIT
     */
    /*<function name="camelCase">*/
    /**
     * 将字符串转换为驼峰命名
     *
     * @param text 字符串
     * @return 返回驼峰字符串
     * @see https://github.com/sindresorhus/camelcase
     * @example camelCase():base
      ```js
      console.log(jstrs.camelCase('box-width'))
      // > boxWidth
      console.log(jstrs.camelCase('boxWidth'))
      // > boxWidth
      ```
      * @example camelCase():Upper
      ```js
      console.log(jstrs.camelCase('FOÈ-BAR'))
      // > foèBar
      console.log(jstrs.camelCase('FBBazzy'))
      // > fbBazzy
      ```
      * @example camelCase():Upper & _
      ```js
      console.log(jstrs.camelCase('BOX_WIDTH'))
      // > boxWidth
      ```
      * @example camelCase():First char is _
      ```js
      console.log(jstrs.camelCase('_BOX_WIDTH'))
      // > boxWidth
      ```
      * @example camelCase():none
      ```js
      console.log(jstrs.camelCase('width'))
      // > width
      ```
      * @example camelCase():Number
      ```js
      console.log(JSON.stringify(jstrs.camelCase(123)))
      // > "123"
      ```
      */
    function camelCase(text) {
        return String(text).replace(/([a-z][^A-Z]*)([A-Z])|([A-Z])([A-Z][a-z])/g, function (all, $1, $2, $3, $4) {
            all;
            return ($1 || $3) + '-' + ($2 || $4);
        }).replace(/^[_.\- ]+/, '')
            .toLowerCase()
            .replace(/[_.\- ]+(\w|$)/g, function (all, $1) {
            all;
            return $1.toUpperCase();
        });
    } /*</function>*/
    /*<function name="createGetter" depend="camelCase">*/
    /**
     * 创建读取键值的方法
     *
     * @param {Object} target 目标对象
     * @param {Function} getter 读取一个键值函数
     *  getter -> function(name, fn)
     '''<example>'''
     * @example createGetter():base
      ```js
      let dict = { a: 1, b: 2, c: 3, 101: 5 }
      let food = {}
      food.get = jsets.createGetter(food, function(name) {
          return dict[name]
      })
      console.log(JSON.stringify(food.get('a')))
      // > 1
      console.log(JSON.stringify(food.get(101)))
      // > 5
      food.get('a', function(a) {
        console.log(JSON.stringify(a))
        // > 1
      })
      food.get(function(c, b, a) {
        console.log(JSON.stringify([a, b, c]))
        // > [1,2,3]
      })
      food.get(['a', 'b'], function(a, b) {
          console.log(JSON.stringify(a))
          // > 1
          console.log(JSON.stringify(b))
          // > 2
      })
      console.log(JSON.stringify(food.get(['a', 'b'])))
      // > {"a":1,"b":2}
      ```
      '''</example>'''
     */
    function createGetter(target, getter, camel) {
        var method = function (name, fn) {
            var result;
            var keys;
            if (typeof name === 'function') {
                keys = name['-jsets-params'];
                if (!keys) {
                    keys = [];
                    String(name).replace(/\(\s*([^()]+?)\s*\)/, function (all, names) {
                        keys = names.split(/\s*,\s*/);
                        return '';
                    });
                    name['-jsets-params'] = keys;
                }
                return method(keys, name);
            }
            if (typeof name === 'string' || typeof name === 'number') {
                name = camel ? camelCase(String(name)) : name;
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
                var key = void 0;
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
    exports.createGetter = createGetter;
    /*<function name="createSetter" depend="camelCase">*/
    /**
     * 创建设置键值的方法
     *
     * @param target 目标对象
     * @param setter 设置一个键值函数
     *  setter -> function(name, value)
     * @param camel 键值是否需要驼峰化
     '''<example>'''
     * @example createSetter():base
      ```js
      let dict = {}
      let food = {}
      food.set = jsets.createSetter(food, function(name, value) {
        dict[name] = value
      })
      food.set('a', 1)
      console.log(JSON.stringify(dict))
      // > {"a":1}
      food.set({
        b: 2,
        c: 3
      })
      console.log(JSON.stringify(dict))
      // > {"a":1,"b":2,"c":3}
      ```
      '''</example>'''
     */
    function createSetter(target, setter, camel) {
        return function (name, value) {
            if (typeof name === 'string' || typeof name === 'number') {
                setter(camel ? camelCase(String(name)) : name, value);
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
    exports.createSetter = createSetter;
});
