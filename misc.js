export { setTimeout as sleep } from 'node:timers/promises';
export function option(key, value) {
    return value === null || value === undefined ? undefined : { [key]: value };
}
//# sourceMappingURL=misc.js.map