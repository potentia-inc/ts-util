// A length of time.
//
// A plain `number` is milliseconds (the JavaScript convention) and may be
// fractional, so sub-millisecond values are expressed as fractions of a
// millisecond (e.g. 0.5 === 500 microseconds) — no separate sub-ms unit is
// needed. A string carries an explicit unit suffix and may be fractional
// (e.g. '1.5s', '0.5ms').
//
// Unit names follow C++ <chrono>. Only 's' (seconds) and 'ms' (milliseconds)
// are supported for now; 'ns', 'us', 'min' and 'h' are reserved for the future
// (note: minutes are 'min', never 'm', to avoid colliding with 'ms').
export type Duration = number | `${number}s` | `${number}ms`

const DURATION = /^(-?\d+(?:\.\d+)?)(ms|s)$/

// Convert a Duration to milliseconds. Throws RangeError on a string without a
// recognized unit suffix (including a bare numeric string such as '100', which
// must be written as the number 100 or the string '100ms').
export function toMs(duration: Duration): number {
  if (typeof duration === 'number') return duration
  const matched = DURATION.exec(duration)
  if (matched === null) {
    throw new RangeError(`invalid duration: ${JSON.stringify(duration)}`)
  }
  const value = Number(matched[1])
  return matched[2] === 's' ? value * 1000 : value
}
