// Opt-in side effect: importing this module installs `BigInt.prototype.toJSON`
// so that `JSON.stringify` serializes bigints as decimal strings.
//
//   import '@potentia/util/bigint-json'
//   JSON.stringify({ a: 1n }) // => '{"a":"1"}'
//
// It is intentionally NOT part of the main entry point: a foundational
// library should not mutate a global prototype as a side effect of import.

declare global {
  interface BigInt {
    toJSON: () => string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export {}
