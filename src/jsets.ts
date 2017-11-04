/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 <% if (typeof repository != 'undefined') { %>
 * @url <%- repository.url %>
 <% } %>
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }) %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 * @license <%- license %>
 */
/*</jdists>*/

/*<jdists encoding="fndep" import="../node_modules/jstrs/lib/jstrs.ts" depend="camelCase">*/
import { camelCase } from 'jstrs'
/*</jdists>*/

export interface IGetter {
  (name: string | number | Function, fn: Function): any
}

export interface ISetter {
  (name: string | number | string[], value: any): object
}

export interface IGetterFunction {
  (name: string | number): any
}

export interface ISetterFunction {
  (name: string | number, value: any)
}

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
function createGetter(target: object, getter: IGetterFunction, camel: boolean) {
  /*<safe>*/
  if (!getter) {
    throw new Error('createGetter() getter is undefined.')
  }
  /*</safe>*/
  let method = (name: string | number | Function | string[], fn: Function): any => {
    let result

    let keys
    if (typeof name === 'function') {
      keys = name['-jsets-params']
      if (!keys) { // 优先从缓存中获取
        keys = []
        String(name).replace(/\(\s*([^()]+?)\s*\)/,
          (all, names) => {
            keys = names.split(/\s*,\s*/)
            return ''
          }
        )
        name['-jsets-params'] = keys
      }
      return method(keys, name)
    }

    if (typeof name === 'string' || typeof name === 'number') {
      name = camel ? camelCase(String(name)) : name
      if (typeof fn === 'function') {
        fn.call(target, getter(name))
        return target
      }
      return getter(name)
    }

    if (typeof name === 'object') {
      if (name instanceof Array) {
        if (typeof fn === 'function') {
          result = []
          name.forEach((n) => {
            result.push(getter(camel ? camelCase(n) : n))
          })
          fn.apply(target, result)
          return target
        }
        result = {}
        name.forEach((n) => {
          result[n] = getter(camel ? camelCase(n) : n)
        })
        return result
      }

      let key
      if (typeof fn === 'function') {
        result = []
        for (key in name) {
          result.push(getter(camel ? camelCase(key) : key) || name[key])
        }
        return target
      }
      result = {}
      for (key in name) {
        result[key] = getter(camel ? camelCase(key) : key) || name[key]
      }
      return result
    }
  }
  return method
}
/*</function>*/

export {
  createGetter
}

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
function createSetter(target: object, setter: ISetterFunction, camel: boolean): ISetter {
  /*<safe>*/
  if (!setter) {
    throw new Error('createSetter() setter is undefined.')
  }
  /*</safe>*/
  return (name: string | number | string[], value: any): object => {
    if (typeof name === 'string' || typeof name === 'number') {
      setter(camel ? camelCase(String(name)) : name, value)
    }
    else if (typeof name === 'object') {
      if (name instanceof Array) {
        name.forEach((n, i) => {
          setter(i, n)
        })
      }
      else {
        for (let key in name) {
          setter(camel ? camelCase(key) : key, name[key])
        }
      }
    }
    return target
  }
}
/*</function>*/

export {
  createSetter
}