import type { Size, Vector2 } from '../types';

const RE_ARRAY_PART = /(\w+)\[(\d+)\]/;

export function* iterateGrid(size: Size): IterableIterator<Vector2> {
  const { x: x1, y: y1 } = { x: 0, y: 0 };
  const { x: x2, y: y2 } = { x: size.w, y: size.h };
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      yield { x, y };
    }
  }
}

export function keys<T extends {}>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export function entries<T extends {}>(o: T): [keyof T, T[keyof T]][] {
  return Object.entries(o) as [keyof T, T[keyof T]][];
}

export function set(object: any, path: string, value: unknown): any {
  const parts = path.split('.');
  let next = object;
  for (let i = 0; i < parts.length; i++) {
    const match = parts[i].match(RE_ARRAY_PART);
    if (match) {
      // we're dealing with an array – e.g., foo[2]
      // update with the existing value or create an empty array
      next = next[match[1]] ??= [];
      // push a new (numeric) key onto the parts array
      parts.splice(i + 1, 0, match[2]);
      continue;
    }
    // if we've reached the last key, set the value—otherwise keep going,
    // moving onto what's already there (or an empty object, as needed).
    next = next[parts[i]] ??= i === parts.length - 1 ? value : {};
  }
  return object;
}

export const _ = { keys, entries, set };
