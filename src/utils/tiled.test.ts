import type { TilesetData } from '../types';

import { describe, expect, test } from '@jest/globals';

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
