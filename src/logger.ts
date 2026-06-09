// The leveled logger core. It owns levels, the record shape, and dispatch to
// sinks; it makes no outbound calls and knows nothing about gchat/slack/etc.
//
// Alert sinks are NOT shipped here — they are ~10-line copy-paste recipes in the
// README that implement the Sink interface, typically wiring a Dispatcher (from
// './dispatcher.js') inside `handle`. This core never imports the dispatcher.

// Log severity, ordered trace < debug < info < warn < error < fatal.
export type Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

// The level order, low to high.
export const LEVELS = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const

const ORDER: Record<Level, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
}

// Structured fields attached to a record (and merged from child bindings).
export type Fields = Record<string, unknown>

// A single structured log entry, as seen by every sink. The same instance is
// passed to every sink — treat it as read-only.
export interface LogRecord {
  level: Level
  // When the record was created. Serializes to an ISO-8601 string via JSON.
  time: Date
  // The originating logger's name.
  name: string
  message: string
  // Structured fields, including any merged from child-logger bindings.
  fields?: Fields
}

// A log destination. The built-in console sink is one; alert sinks (gchat,
// slack, a WebSocket, ...) are user recipes implementing this same interface.
// This is the firewall: the core only ever talks to a Sink, never to a service.
export interface Sink {
  // Minimum level this sink receives; defaults to the logger's own level.
  level?: Level
  // Receive a record at/above this sink's level. Must not throw (a sink that
  // dispatches asynchronously swallows its own errors).
  handle(record: LogRecord): void
  // Drain any buffered/pending deliveries. Awaited by Logger.flush().
  flush?(): Promise<void>
  // Release resources / tear down connections (e.g. close a WebSocket). Awaited
  // by Logger.close() after a final flush. Connectionless sinks omit it; the
  // connection state lives in the sink's own closure, never in the core.
  close?(): Promise<void>
}

// Renders a record to a string for the console sink. Custom sinks do their own
// formatting from the raw LogRecord and are unaffected by this.
export type Format = (record: LogRecord) => string

// Compact single-line JSON — machine-readable, the default off a TTY.
export const jsonFormat: Format = (record) => JSON.stringify(record)

// Human-readable single line, the default on a TTY.
export const prettyFormat: Format = (record) => {
  const time = record.time.toISOString()
  const level = record.level.toUpperCase().padEnd(5)
  const fields =
    record.fields && Object.keys(record.fields).length > 0
      ? ' ' + JSON.stringify(record.fields)
      : ''
  return `[${time}] ${level} ${record.name}: ${record.message}${fields}`
}

function defaultFormat(): Format {
  return process.stdout.isTTY ? prettyFormat : jsonFormat
}

// The built-in console sink: formats each record to a string and writes it —
// warn and above to stderr, the rest to stdout. Defaults to prettyFormat on a
// TTY and jsonFormat otherwise; pass an explicit format to override. Exported so
// recipes can add a second console.
export function consoleSink(format: Format = defaultFormat()): Sink {
  return {
    handle(record) {
      const line = format(record)
      if (ORDER[record.level] >= ORDER.warn) console.error(line)
      else console.log(line)
    },
  }
}

export interface LoggerOptions {
  // Logger name, attached to every record.
  name: string
  // Minimum level to emit. Default 'info'. This is the floor: a sink can filter
  // higher with its own `level`, but to capture lower levels in any sink, lower
  // the logger's level here.
  level?: Level
  // Extra sinks beyond the console.
  sinks?: Sink[]
  // Include the built-in console sink. Default true. Set false for a
  // console-silent logger that only feeds `sinks` (e.g. pure alerting).
  console?: boolean
  // Override the console sink's formatting. Default: prettyFormat on a TTY,
  // jsonFormat otherwise. Pass jsonFormat/prettyFormat (both exported) or your
  // own to force one regardless of the terminal.
  format?: Format
}

export interface Logger {
  trace(message: string, fields?: Fields): void
  debug(message: string, fields?: Fields): void
  info(message: string, fields?: Fields): void
  warn(message: string, fields?: Fields): void
  error(message: string, fields?: Fields): void
  fatal(message: string, fields?: Fields): void
  // A sub-logger that merges `bindings` into every record's fields.
  child(bindings: Fields): Logger
  // Fan out flush() to every sink (await pending deliveries).
  flush(): Promise<void>
  // Final flush, then fan out close() to every sink. For graceful shutdown.
  close(): Promise<void>
}

// Create a Logger. The console sink is included by default; pass alert-sink
// recipes via `sinks`.
export function createLogger(options: LoggerOptions): Logger {
  const {
    name,
    level = 'info',
    sinks = [],
    console: useConsole = true,
    format,
  } = options
  const allSinks: Sink[] = useConsole
    ? [consoleSink(format), ...sinks]
    : [...sinks]
  return build(name, ORDER[level], undefined, allSinks)
}

function build(
  name: string,
  threshold: number,
  bindings: Fields | undefined,
  sinks: Sink[],
): Logger {
  function emit(level: Level, message: string, extra?: Fields): void {
    if (ORDER[level] < threshold) return
    const merged = { ...bindings, ...extra }
    const record: LogRecord = { level, time: new Date(), name, message }
    if (Object.keys(merged).length > 0) record.fields = merged
    for (const sink of sinks) {
      const min = sink.level === undefined ? threshold : ORDER[sink.level]
      if (ORDER[level] >= min) sink.handle(record)
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
      await Promise.all(sinks.map((s) => s.flush?.()))
    },
    close: async () => {
      await Promise.all(sinks.map((s) => s.flush?.()))
      await Promise.all(sinks.map((s) => s.close?.()))
    },
  }
}
