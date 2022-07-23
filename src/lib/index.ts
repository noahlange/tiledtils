import type { TiledData } from '../types';

import { Tiled } from './Tiled';
import { TiledIsometric } from './TiledIsometric';
import { TiledOrthographic } from './TiledOrthographic';

Tiled.from = (data: TiledData): Tiled => {
  return data.orientation === 'isometric'
    ? new TiledIsometric(data)
    : new TiledOrthographic(data);
};

export type { TiledLayer } from './TiledLayer';

export { Tiled } from './Tiled';
export { TiledOrthographic } from './TiledOrthographic';
export { TiledIsometric } from './TiledIsometric';
