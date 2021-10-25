import { isObject } from '..'

describe('isObject', () => {
  it('returns true on a plain object', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false on an object that is not plain', () => {
    expect(isObject(1)).toBe(false)
    expect(isObject('foo')).toBe(false)
  })
})
