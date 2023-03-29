import type {
  Atlas,
  AtlasFrame,
  Properties,
  TiledData,
  TiledObject,
  TiledTile,
  TilesetData,
  Vector2
} from '../types';

import { getAtlasesFromTilesets, getTiledProperties } from '../utils';
import { getTileIdentifier } from '../utils';
import { TiledLayer } from './TiledLayer';

export interface LayerTileData extends AtlasFrame {
  id: string;
  texture: string;
  tileset: TilesetData | null;
}

export abstract class Tiled {
  public declare static from: (data: TiledData) => Tiled;

  public readonly properties: Properties;
  public readonly tilesets: TilesetData[] = [];
  public readonly layers: TiledLayer[] = [];
  public readonly tilemap: TiledData;
  public readonly atlases: Record<string, Atlas> = {};

  public get tiles(): TiledTile[] {
    return this.layers.flatMap(layer => layer.tiles);
  }

  public get objects(): TiledObject[] {
    return this.layers.flatMap(layer => layer.objects);
  }

  public getTileID!: (index: number) => string;

  public getTileset(index: number | null): TilesetData | null {
    if (index === null) {
      return null;
    }
    for (const tileset of this.tilesets) {
      if (index < tileset.firstgid - 1) {
        continue;
      }
      return tileset;
    }
    return null;
  }

  public get tileWidth(): number {
    return this.tilemap.tilewidth;
  }

  public get tileHeight(): number {
    return this.tilemap.tileheight;
  }

  public get width(): number {
    return this.tilemap.width;
  }

  public get height(): number {
    return this.tilemap.height;
  }

  /**
   * Return the screen coordinates corresponding to the point in the game world.
   */
  public abstract toWorldPoint(screen: Vector2): Vector2;

  /**
   * Return the world coordinates corresponding to the point on the screen.
   */
  public abstract toScreenPoint(screen: Vector2): Vector2;

  public constructor(data: TiledData) {
    this.tilemap = data;
    this.tilesets = this.tilemap.tilesets;
    this.getTileID = getTileIdentifier(this.tilesets);
    this.atlases = getAtlasesFromTilesets(this.tilesets);
    this.properties = getTiledProperties(this.tilemap.properties);
    this.layers = data.layers.map(l => new TiledLayer(this, l));
  }
}
