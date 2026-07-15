import { writeFileSync } from 'node:fs';
// The kernel caps a task's comm name (/proc/self/comm) at TASK_COMM_LEN - 1.
const COMM_MAX_BYTES = 15;
// Trim `title` to at most COMM_MAX_BYTES UTF-8 bytes without splitting a
// multi-byte codepoint. Process names are almost always ASCII, but we count
// bytes so a stray multi-byte character can't overflow the kernel's buffer.
function truncateComm(title) {
    const encoder = new TextEncoder();
    let out = title;
    while (encoder.encode(out).length > COMM_MAX_BYTES)
        out = out.slice(0, -1);
    return out;
}
// Set the process title, doing as much as the runtime allows.
//
// `process.title = title` is the native mechanism: on Node.js it rewrites the
// argv memory (so `ps`/`/proc/self/cmdline` show the new title) and sets the
// kernel comm name. On Bun and Deno the setter is a no-op, so the title would
// otherwise never change.
//
// On Linux we additionally write the title (truncated to the kernel's 15-byte
// comm limit) to `/proc/self/comm`, which every runtime honors — that is how
// Bun and Deno get a visible title at all (in `ps -o comm`, `top`, `htop`,
// `/proc/<pid>/comm`). The write is best-effort: a locked-down or non-standard
// `/proc` just leaves the title unchanged rather than throwing.
export function setProcessTitle(title) {
    process.title = title;
    if (process.platform === 'linux') {
        try {
            writeFileSync('/proc/self/comm', truncateComm(title));
        }
        catch {
            // Best effort: no writable /proc, so the native assignment is all we get.
        }
    }
}
