import { NIL, Nil, TypeOrNil } from './type.js'
export { setTimeout as sleep } from 'node:timers/promises'

export function option<T>(
  key: string,
  value: T | Nil | null,
): TypeOrNil<Record<string, NonNullable<T>>> {
  return value === NIL || value === null ? NIL : { [key]: value }
}
