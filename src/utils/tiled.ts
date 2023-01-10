import type { Properties, Property, TilesetData } from '../types';

import { _ } from './misc';

export function getTiledProperties(properties: Property[] = []): Properties {
  const res = {};
  try {
    for (const property of properties) {
      _.set(res, property.name, property.value);
    }
  } catch (e) {
    console.warn('Failed to flatten Tiled properties.');
  }
  return res;
}

export function getTilesetName(tileset: TilesetData): string {
  const source = tileset.name ?? tileset.image ?? tileset.source;
  const popped = source.split('/').pop() ?? source;
  return popped.replace(/\.(\w+)/, '');
}

export function getTileIdentifier(
  tilesets: TilesetData[]
): (id: number) => string {
  const sources = tilesets
    .sort((a, b) => b.firstgid - a.firstgid)
    .map(set => ({ name: getTilesetName(set), firstgid: set.firstgid }));

  return (id: number): string => {
    // use the name of the first tileset with a firstgid < id the user passes in
    for (const { name, firstgid } of sources) {
      if (firstgid <= id) {
        const tileID = (id - firstgid).toString();
        return `${name}.${tileID.padStart(3, '0')}`;
      }
    }
    return id.toString();
  };
}
