export const chunk = <Value>(array: Array<Value>, batchLength: number): Array<Array<Value>> => {
  const batch = array.slice(0, batchLength)

  if (batch.length <= 0) {
    return []
  }

  return [batch, ...chunk(array.slice(batchLength), batchLength)]
}
