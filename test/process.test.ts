import { strict as assert } from 'node:assert'
import { describe, test, after } from 'node:test'
import { setProcessTitle } from '../src/process.js'

// We can't portably assert the *effect*: `process.title` only takes on Node,
// `/proc/self/comm` only exists on Linux, and both are no-ops elsewhere. So the
// contract we test is the portable one — the function exists and runs without
// throwing on whatever runtime is executing this suite (Node or Deno here; Bun
// covers it via smoke.mjs).
describe('setProcessTitle', () => {
  const original = process.title

  after(() => {
    setProcessTitle(original)
  })

  test('is a function', () => {
    assert.equal(typeof setProcessTitle, 'function')
  })

  test('runs without throwing', () => {
    assert.doesNotThrow(() => setProcessTitle('potentia-title'))
  })

  test('runs without throwing for an over-length title', () => {
    assert.doesNotThrow(() => setProcessTitle('0123456789abcdefghij'))
  })
})
