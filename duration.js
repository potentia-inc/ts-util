const DURATION = /^(-?\d+(?:\.\d+)?)(ms|s)$/;
// Convert a Duration to milliseconds. Throws RangeError on a string without a
// recognized unit suffix (including a bare numeric string such as '100', which
// must be written as the number 100 or the string '100ms').
export function toMs(duration) {
    if (typeof duration === 'number')
        return duration;
    const matched = DURATION.exec(duration);
    if (matched === null) {
        throw new RangeError(`invalid duration: ${JSON.stringify(duration)}`);
    }
    const value = Number(matched[1]);
    return matched[2] === 's' ? value * 1000 : value;
}
