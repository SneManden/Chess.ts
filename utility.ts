export function notNullish<T>(obj: T | null | undefined): obj is T {
  return obj !== null && obj !== undefined;
}

export function isNullish<T>(obj: T | null | undefined): obj is null | undefined {
  return obj === null || obj === undefined;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

declare global {
  interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
  }
}

Array.prototype.first = function <T>(this: T[]): T | undefined {
  return this[0];
}

Array.prototype.last = function <T>(this: T[]): T | undefined {
  return this[this.length - 1];
}
