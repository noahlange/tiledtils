import type {
  LayerData,
  TiledObject,
  TiledTile,
  TilesetData,
  Vector2
} from '../types';
import type { Tiled } from './Tiled';

import { nanoid } from 'nanoid';

import { getTiledProperties } from '../utils';
import { iterateGrid } from '../utils/misc';

export class TiledLayer {
  public readonly id: string = nanoid(8);

  public get type(): string {
    return this.layer.type;
  }

  public get name(): string {
    return this.layer.name;
  }

  public get x(): number {
    return this.layer.x;
  }

  public get y(): number {
    return this.layer.y;
  }

  public get width(): number {
    return this.layer.width ?? 0;
  }

  public get height(): number {
    return this.layer.height ?? 0;
  }

  public get isVisible(): boolean {
    return this.layer.visible;
  }

  public get opacity(): number {
    return this.layer.opacity ?? 1;
  }

  public get tiles(): TiledTile[] {
    return (this._tiles ??= Array.from(this.tileData()));
  }

  public get objects(): TiledObject[] {
    return (this._objects ??= Array.from(this.objectData()));
  }

  protected tiled: Tiled;
  protected layer: LayerData;
  protected z: number;
  protected _tiles: TiledTile[] | null = null;
  protected _objects: TiledObject[] | null = null;

  protected getZIndex(point: Vector2): number {
    return point.x * this.height + point.y + this.z;
  }

  protected *tileData(): IterableIterator<TiledTile> {
    let i = 0;
    const layer = this;
    for (const point of iterateGrid({ w: this.width, h: this.height })) {
      // get the numeric ID as determined by Tiled
      const index = this.layer.data?.[i++] ?? null;
      // get the corresponding tileset for the ID
      const tileset = layer.tiled.getTileset(index);
      if (index && tileset) {
        const texture = layer.tiled.getTileID(index);
        const [atlasName, frameID] = texture.split('.');
        const atlas = layer.tiled.atlases[atlasName]?.frames[frameID];
        if (atlas) {
          const world = point;
          // convert the game point to absolute pixels
          const screen = layer.tiled.toScreenPoint(point);
          yield {
            anchor: { x: 0.5, y: 1 },
            offset: { x: 0, y: 0 },
            ...atlas,
            ...world,
            texture,
            world,
            zIndex: this.getZIndex(world),
            screen: {
              x: screen.x + (atlas.offset?.x ?? 0),
              y: screen.y + (atlas.offset?.y ?? 0)
            },
            get layer(): TiledLayer {
              return layer;
            },
            get tileset(): TilesetData {
              return tileset;
            }
          };
        }
      }
    }
  }

  protected *objectData(): IterableIterator<TiledObject> {
    const objects = this.layer.objects ?? [];
    const layer = this;
    yield* objects.map(o => {
      const world = {
        x: Math.floor(o.x) / this.tiled.tileHeight,
        y: Math.floor(o.y / this.tiled.tileHeight)
      };
      const screen = this.tiled.toScreenPoint(world);
      return {
        ...o,
        anchor: { x: 0.5, y: 1 },
        offset: { x: 0, y: 0 },
        id: o.id?.toString() ?? nanoid(8),
        properties: getTiledProperties(o),
        screen,
        world,
        get zIndex(): number {
          return layer.getZIndex(world);
        },
        get layer(): TiledLayer {
          return layer;
        }
      };
    });
  }

  public constructor(tiled: Tiled, layer: LayerData) {
    this.tiled = tiled;
    this.layer = layer;
    this.z = tiled.layers.indexOf(this);
  }
}
