import type { Vector2 } from '../types';

import { Tiled } from './Tiled';

export class TiledOrthographic extends Tiled {
  public toScreenPoint(point: Vector2): Vector2 {
    return {
      x: Math.floor(point.x / this.tilemap.tilewidth),
      y: Math.floor(point.y / this.tilemap.tileheight)
    };
  }

  public toWorldPoint(point: Vector2): Vector2 {
    return {
      x: point.x * this.tilemap.tilewidth,
      y: point.y * this.tilemap.tileheight
    };
  }
}
