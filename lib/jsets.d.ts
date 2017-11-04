export interface IGetter {
    (name: string | number | Function, fn: Function): any;
}
export interface ISetter {
    (name: string | number | string[], value: any): object;
}
export interface IGetterFunction {
    (name: string | number): any;
}
export interface ISetterFunction {
    (name: string | number, value: any): any;
}
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
declare function createGetter(target: object, getter: IGetterFunction, camel: boolean): (name: string | number | Function | string[], fn: Function) => any;
export { createGetter };
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
declare function createSetter(target: object, setter: ISetterFunction, camel: boolean): ISetter;
export { createSetter };
