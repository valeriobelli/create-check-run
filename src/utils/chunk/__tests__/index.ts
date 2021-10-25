import { chunk } from '..'

describe('chunk', () => {
  it('chunks an empty array', () => {
    const array: string[] = []

    expect(chunk(array, 10)).toEqual([])
  })

  it('chunks an array with less elements compared to the batch size', () => {
    const array = [1, 2, 3]

    expect(chunk(array, 10)).toStrictEqual([[1, 2, 3]])
  })

  it('chunks an array with more elements compared to the batch size', () => {
    const array = [1, 2, 3]

    expect(chunk(array, 1)).toStrictEqual([[1], [2], [3]])
  })
})
