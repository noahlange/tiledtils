import type { Atlas, AtlasFrame, TilesetData } from '../types';

import { iterateGrid } from './misc';
import { getTiledProperties } from './tiled';

export function getAtlasFromTileset(tileset: TilesetData): Atlas {
  const {
    columns,
    imagewidth: iw,
    imageheight: ih,
    name,
    tiles = [],
    tileoffset,
    tilewidth: tw,
    tileheight: th
  } = tileset;

  const frames: Record<string, AtlasFrame> = {};
  const bounds = {
    w: Math.floor(columns),
    h: Math.floor(ih / th)
  };

  let index = 0;

  for (const point of iterateGrid(bounds)) {
    const properties = tiles[index]?.properties ?? [];
    // this is entirely arbitrary and the texture IDs might look weird if the tileset has >999 tiles
    const id = index.toString().padStart(3, '0');

    frames[id] = {
      id,
      frame: { x: point.x * tw, y: point.y * th, w: tw, h: th },
      offset: tileoffset ?? { x: 0, y: 0 },
      properties: getTiledProperties(properties)
    };

    index++;

    if (index >= tileset.tilecount) {
      break;
    }
  }

  return {
    id: name,
    meta: {
      name,
      scale: '1',
      image: tileset.image,
      size: { w: iw, h: ih }
    },
    frames,
    animations: {}
  };
}

export function getAtlasesFromTilesets(
  tilesets: TilesetData[]
): Record<string, Atlas> {
  return tilesets
    .map(getAtlasFromTileset)
    .reduce((a, b) => ({ ...a, [b.meta.name]: b }), {});
}
