import { Nil, TypeOrNil } from './type.js'
import { setTimeout } from 'node:timers/promises'

// for backward compatibility
export { setTimeout as sleep } from 'node:timers/promises'

export async function ssleep(s: number) {
  return msleep(s * 1000)
}

export async function msleep(ms: number) {
  const invalid = isNaN(ms) || ms < 1 || ms > 2147483647
  await setTimeout(invalid ? 1 : ms)
  return !invalid
}

export function option<T>(
  key: string,
  value: T | Nil | null,
): TypeOrNil<Record<string, NonNullable<T>>> {
  return value === Nil || value === null ? Nil : { [key]: value }
}
