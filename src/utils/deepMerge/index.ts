import * as A from 'fp-ts/Array'
import * as f from 'fp-ts/function'
import { isObject } from '~/utils/isObject'

type Primitive = string | number | boolean | unknown

type Obj = Record<string, Primitive | Array<Primitive> | { [key: string]: Primitive | Array<Primitive> | Obj }>

type DeepMerge = {
  <O1 extends Obj, O2 extends Obj>(o1: O1, o2: O2): O1 & O2
  <O1 extends Obj, O2 extends Obj, O3 extends Obj>(o1: O1, o2: O2, o3: O3): O1 & O2 & O3
}

export const deepMerge: DeepMerge = (...objects: Obj[]) =>
  f.pipe(
    objects,
    A.reduce({} as Obj, (mainObject, object) =>
      f.pipe(
        object,
        Object.keys,
        A.reduce(mainObject, (acc, key) => {
          const accValue = acc[key]
          const objectValue = object[key]

          if (Array.isArray(accValue) && Array.isArray(objectValue)) {
            return { ...acc, [key]: [...accValue, ...objectValue] }
          }

          if (isObject(accValue) && isObject(objectValue)) {
            return { ...acc, [key]: deepMerge(accValue, objectValue) }
          }

          return { ...acc, [key]: objectValue }
        })
      )
    )
  )
