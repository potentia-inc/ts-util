export { setTimeout as sleep } from 'node:timers/promises'

export function option<T>(
  key: string,
  value: T | undefined,
): Record<string, NonNullable<T>> | undefined {
  return value === null || value === undefined ? undefined : { [key]: value }
}
