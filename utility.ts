export function notNullish<T>(obj: T | null | undefined): obj is T {
  return obj !== null && obj !== undefined;
}

export function isNullish<T>(obj: T | null | undefined): obj is null | undefined {
  return obj === null || obj === undefined;
}
