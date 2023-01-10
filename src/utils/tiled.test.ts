import type { TilesetData } from '../types';

import { describe, expect, test } from '@jest/globals';

import { PropertyType } from '../types';
import * as utils from './tiled';

describe('getTileIdentifier()', () => {
  const tilesets = [
    { firstgid: 0, source: 'one' },
    { firstgid: 10, source: 'two' },
    { firstgid: 20, source: 'three' },
    { firstgid: 30, source: 'four' },
    { firstgid: 40, source: 'five' },
    { firstgid: 50, source: 'six' }
  ] as any[] as TilesetData[];

  test('should return tileset + tile id from index offset', () => {
    const getID = utils.getTileIdentifier(tilesets);

    expect(getID(0)).toEqual('one.000');
    expect(getID(26)).toEqual('three.006');
    expect(getID(60)).toEqual('six.010');
  });
});

describe('getTiledProperties()', () => {
  test('...sets simple properties', () => {
    const values = utils.getTiledProperties([
      { name: 'a', type: PropertyType.STRING, value: '2' }
    ]);
    expect(values).toStrictEqual({ a: '2' });
  });

  test('...sets nested properties', () => {
    const values = utils.getTiledProperties([
      { name: 'b.name', type: PropertyType.INTEGER, value: 2 }
    ]);
    expect(values).toStrictEqual({ b: { name: 2 } });
  });

  test('...sets array properties', () => {
    const values = utils.getTiledProperties([
      { name: 'c[0]', type: PropertyType.OBJECT, value: 3 },
      { name: 'c[1]', type: PropertyType.OBJECT, value: 4 }
    ]);
    expect(values).toStrictEqual({ c: [3, 4] });
  });

  test('...sets a mix of properties', () => {
    const values = utils.getTiledProperties([
      { name: 'a', type: PropertyType.STRING, value: '2' },
      { name: 'b.name', type: PropertyType.INTEGER, value: 2 },
      { name: 'c.bar[0]', type: PropertyType.OBJECT, value: 3 },
      { name: 'c.bar[1].bat', type: PropertyType.OBJECT, value: 4 }
    ]);
    expect(values).toStrictEqual({
      a: '2',
      b: { name: 2 },
      c: { bar: [3, { bat: 4 }] }
    });
  });
});
