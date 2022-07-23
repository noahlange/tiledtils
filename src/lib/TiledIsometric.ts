import type { Vector2 } from '../types';

import { Tiled } from './Tiled';

export class TiledIsometric extends Tiled {
  public toScreenPoint(point: Vector2): Vector2 {
    return {
      x: Math.floor(((point.x - point.y) * this.tilemap.tilewidth) / 2),
      y: Math.floor(((point.y + point.x) * this.tilemap.tileheight) / 2)
    };
  }

  /**
   * For a given screen coordinate, return the corresponding world coordinates. Note that we're rounding instead of flooring here: if we're getting a unevenly-divisible coordinate value, it's likely from an input or similarly imprecise source. In this case, rounding would be the more expected behavior.
   */
  public toWorldPoint(point: Vector2): Vector2 {
    const tmpX = (point.x * 2) / this.tilemap.tilewidth;
    const tmpY = (point.y * 2) / this.tilemap.tileheight;
    const x = Math.round((tmpX + tmpY) / 2);
    const y = Math.round(tmpY - x);
    return { x, y };
  }
}
