import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
// Opt-in side effect: installs BigInt.prototype.toJSON for this process.
import '../src/patch/bigint/json.js'

describe('patch/bigint/json', () => {
  test('JSON.stringify serializes bigint as a decimal string', () => {
    assert.equal(JSON.stringify({ a: 123n }), '{"a":"123"}')
    assert.equal(JSON.stringify(0n), '"0"')
  })
})
