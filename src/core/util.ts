/**
 * @file util.ts
 */

let idStart = 0x0328;

export function guid(): number {
    return idStart++;
}

export function logError(...args: any[]): void {
    if (typeof console !== 'undefined') {
        console.error.apply(console, args);
    }
}
