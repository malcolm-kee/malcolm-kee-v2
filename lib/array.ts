/**
 * Check if an item is within an array OR if a string is part of a bigger string
 */
export function includes(array: string, item: string): boolean;
export function includes<T>(array: T[], item: T): boolean;
export function includes<T>(array: T[] | string, item: T | string): boolean {
  return (
    (Array.isArray(array) || typeof array === 'string') &&
    array.indexOf(item as any) > -1
  );
}
