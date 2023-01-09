import type { Size, Vector2 } from '../types';

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

export const _ = { keys, entries };
