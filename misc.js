import { Nil } from './type.js';
import { setTimeout } from 'node:timers/promises';
// for backward compatibility
export { setTimeout as sleep } from 'node:timers/promises';
export async function ssleep(s) {
    return msleep(s * 1000);
}
export async function msleep(ms) {
    const invalid = isNaN(ms) || ms < 1 || ms > 2147483647;
    await setTimeout(invalid ? 1 : ms);
    return !invalid;
}
export function option(key, value) {
    return value === Nil || value === null ? Nil : { [key]: value };
}
//# sourceMappingURL=misc.js.map