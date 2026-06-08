import { Nil, isNullish, type TypeOrNil } from './type.js'
import { toMs, type Duration } from './duration.js'
import { setTimeout as setTimeoutPromise } from 'node:timers/promises'

// Maximum delay accepted by the platform timer (signed 32-bit ms).
const MAX_DELAY = 2147483647

export interface SleepOptions {
  signal?: AbortSignal
  ref?: boolean
}

async function delay(ms: number, options?: SleepOptions): Promise<void> {
  if (!Number.isFinite(ms) || ms < 0 || ms > MAX_DELAY) {
    throw new RangeError(
      `sleep: delay out of range [0, ${MAX_DELAY}] ms: ${ms}`,
    )
  }
  await setTimeoutPromise(ms, undefined, options)
}

// Sleep for the given Duration (a number is milliseconds; a string carries an
// explicit unit, e.g. '5s' or '100ms'). Throws RangeError on an invalid
// duration. Pass `signal` to cancel.
export async function sleep(
  duration: Duration,
  options?: SleepOptions,
): Promise<void> {
  return delay(toMs(duration), options)
}

// Sleep for `ms` milliseconds (explicit, unambiguous).
export async function msleep(
  ms: number,
  options?: SleepOptions,
): Promise<void> {
  return delay(ms, options)
}

// Sleep for `s` seconds (explicit, unambiguous).
export async function ssleep(s: number, options?: SleepOptions): Promise<void> {
  return delay(s * 1000, options)
}

export function option<T>(
  key: string,
  value: T | Nil | null,
): TypeOrNil<Record<string, NonNullable<T>>> {
  return isNullish(value) ? Nil : { [key]: value as NonNullable<T> }
}
