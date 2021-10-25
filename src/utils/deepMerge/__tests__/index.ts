import { deepMerge } from '..'

describe('deepMerge', () => {
  it('recursively merges the properties of the given objects', () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { b: { d: 3 }, e: 4 }
    const obj3 = { f: [5, 6] }

    const expected = { a: 1, b: { c: 2, d: 3 }, e: 4, f: [5, 6] }

    expect(deepMerge(obj1, obj2, obj3)).toEqual(expected)
  })

  it('concatenates the elements of array keys', () => {
    const obj1 = { a: [1, 3] }
    const obj2 = { a: [2, 4] }

    const expected = { a: [1, 3, 2, 4] }

    expect(deepMerge(obj1, obj2)).toEqual(expected)
  })

  it('the last objects override the previous keys if values are incompatible', () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { a: '', b: '' }
    const obj3 = { b: 2 }

    const expected = { a: '', b: 2 }

    expect(deepMerge(obj1, obj2, obj3)).toEqual(expected)
  })
})
