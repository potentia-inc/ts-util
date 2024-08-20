import { NIL } from './type.js';
export { setTimeout as sleep } from 'node:timers/promises';
export function option(key, value) {
    return value === NIL || value === null ? NIL : { [key]: value };
}
//# sourceMappingURL=misc.js.map