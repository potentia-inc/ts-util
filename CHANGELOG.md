# Change log

## [3.4.0] - 2025-07-09

- Introduce `PromiseTracker` and `TimeoutAbortController`

## [3.3.0] - 2025-04-01

- Introduce `ssleep()` and `msleep()`

## [3.2.0] - 2025-03-13

- Add `getMessage()` to get error's message

## [3.1.0] - 2025-03-12

- Add more pre-defined types: `NumStr`, `NnmStrOrNil`, `BufferOrNil`
- Add more cast functions: `toNumber()`, `toNumberOrNil()`, `toString()`, `toStringOrNil()`
- Add helper function: `isNullish()`
- Add more type utilities: `PickRequired`, `PickPartial`, `MixRequiredPartial`

## [3.0.0] - 2025-02-03

- Upgrade to node-22

## [2.1.1] - 2024-08-29

- Alias undefined as Nil for both value and type

## [2.1.0] - 2024-08-20

- Introduce undefined alias Nil/NIL and related types/utilities
- Support URL with credentials for request()
  e.g. http://user:pass@host/path

## [2.0.1] - 2024-08-16

Refine the tsconfig.json and upgrade packages

## [2.0.0] - 2024-07-30

Swap the type arguments of supress() and default the E to Error

## [1.0.0] - 2024-03-06

The first release
