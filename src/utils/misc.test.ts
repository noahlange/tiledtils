import { expect, test } from '@jest/globals';

import { _ } from './misc';

describe('set()', () => {
  test('...respects existing properties', () => {
    const before = { a: { b: { c: 123 } } };
    const after = { a: { b: { c: 123, d: { e: 456 } } } };
    expect(_.set(before, 'a.b.d.e', 456)).toStrictEqual(after);
  });
});
