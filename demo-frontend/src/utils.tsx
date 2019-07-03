import snakeCase from 'lodash/snakeCase'

export function toSnakeCase(obj: object): object {
  /*
      Turns all keys of an object into snake case strings.
  
      i.e. this:
  
      { test: 'asd', anotherTest: 'def' }
  
      becomes this:
  
      { test: 'asd', another_test: 'def' }
    */
  if (obj === undefined || obj === null) {
    return obj
  }
  const newObj = {}
  Object.keys(obj).forEach(key => {
    newObj[snakeCase(key)] = obj[key]
  })
  return newObj
}
