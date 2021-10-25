export const isObject = (obj: unknown): obj is { [key: string]: unknown } =>
  Object.prototype.toString.call(obj) === '[object Object]'
