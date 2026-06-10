// Opt-in: apply every prototype patch at once. Prefer importing only what you
// need — a single type (`./patch/bigint`) or a single patch
// (`./patch/bigint/json`).
//
//   import '@potentia/util/patch'
import './bigint/index.js';
