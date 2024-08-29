import { Nil } from './type.js';
export { setTimeout as sleep } from 'node:timers/promises';
export function option(key, value) {
    return value === Nil || value === null ? Nil : { [key]: value };
}
//# sourceMappingURL=misc.js.map