// The leveled logger core. It owns levels, the record shape, and dispatch to
// sinks; it makes no outbound calls and knows nothing about gchat/slack/etc.
//
// Alert sinks are NOT shipped here — they are ~10-line copy-paste recipes in the
// README that implement the Sink interface, typically wiring a Dispatcher (from
// './dispatcher.js') inside `handle`. This core never imports the dispatcher.
// The level order, low to high.
export const LEVELS = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
];
const ORDER = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
};
// Compact single-line JSON — machine-readable, the default off a TTY.
export const jsonFormat = (record) => JSON.stringify(record);
// Human-readable single line, the default on a TTY.
export const prettyFormat = (record) => {
    const time = record.time.toISOString();
    const level = record.level.toUpperCase().padEnd(5);
    const fields = record.fields && Object.keys(record.fields).length > 0
        ? ' ' + JSON.stringify(record.fields)
        : '';
    return `[${time}] ${level} ${record.name}: ${record.message}${fields}`;
};
function defaultFormat() {
    return process.stdout.isTTY ? prettyFormat : jsonFormat;
}
// The built-in console sink: formats each record to a string and writes it —
// warn and above to stderr, the rest to stdout. Defaults to prettyFormat on a
// TTY and jsonFormat otherwise; pass an explicit format to override. Exported so
// recipes can add a second console.
export function consoleSink(format = defaultFormat()) {
    return {
        handle(record) {
            const line = format(record);
            if (ORDER[record.level] >= ORDER.warn)
                console.error(line);
            else
                console.log(line);
        },
    };
}
// Create a Logger. The console sink is included by default; pass alert-sink
// recipes via `sinks`.
export function createLogger(options) {
    const { name, level = 'info', sinks = [], console: useConsole = true, format, } = options;
    const allSinks = useConsole
        ? [consoleSink(format), ...sinks]
        : [...sinks];
    return build(name, ORDER[level], undefined, allSinks);
}
function build(name, threshold, bindings, sinks) {
    function emit(level, message, extra) {
        if (ORDER[level] < threshold)
            return;
        const merged = { ...bindings, ...extra };
        const record = { level, time: new Date(), name, message };
        if (Object.keys(merged).length > 0)
            record.fields = merged;
        for (const sink of sinks) {
            const min = sink.level === undefined ? threshold : ORDER[sink.level];
            if (ORDER[level] >= min)
                sink.handle(record);
        }
    }
    return {
        trace: (message, fields) => emit('trace', message, fields),
        debug: (message, fields) => emit('debug', message, fields),
        info: (message, fields) => emit('info', message, fields),
        warn: (message, fields) => emit('warn', message, fields),
        error: (message, fields) => emit('error', message, fields),
        fatal: (message, fields) => emit('fatal', message, fields),
        child: (b) => build(name, threshold, { ...bindings, ...b }, sinks),
        flush: async () => {
            await Promise.all(sinks.map((s) => s.flush?.()));
        },
        close: async () => {
            await Promise.all(sinks.map((s) => s.flush?.()));
            await Promise.all(sinks.map((s) => s.close?.()));
        },
    };
}
