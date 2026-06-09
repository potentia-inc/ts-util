export type Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export declare const LEVELS: readonly ["trace", "debug", "info", "warn", "error", "fatal"];
export type Fields = Record<string, unknown>;
export interface LogRecord {
    level: Level;
    time: Date;
    name: string;
    message: string;
    fields?: Fields;
}
export interface Sink {
    level?: Level;
    handle(record: LogRecord): void;
    flush?(): Promise<void>;
    close?(): Promise<void>;
}
export type Format = (record: LogRecord) => string;
export declare const jsonFormat: Format;
export declare const prettyFormat: Format;
export declare function consoleSink(format?: Format): Sink;
export interface LoggerOptions {
    name: string;
    level?: Level;
    sinks?: Sink[];
    console?: boolean;
    format?: Format;
}
export interface Logger {
    trace(message: string, fields?: Fields): void;
    debug(message: string, fields?: Fields): void;
    info(message: string, fields?: Fields): void;
    warn(message: string, fields?: Fields): void;
    error(message: string, fields?: Fields): void;
    fatal(message: string, fields?: Fields): void;
    child(bindings: Fields): Logger;
    flush(): Promise<void>;
    close(): Promise<void>;
}
export declare function createLogger(options: LoggerOptions): Logger;
