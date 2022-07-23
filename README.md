# tiledtils

A utility library for working with [Tiled](https://www.mapeditor.org) maps and tilesets, particularly (but not necessarily, it's a peer dependency) using PIXI. It abstracts away the tile-index structure of CSV-formatted Tiled maps, mapping the indices to texture keys in sprite atlases autogenerated from embedded tileset data.

Additional features:

- screen/world coordinate mapping for isometric and orthographic maps
- z-indexes for isometric world coordinates
- sprite offsets
- array → object custom property conversion
- easy layer/tile iteration
- flat iteration through all tiles, objects
- spritesheet, atlases generation from tileset data
- lazy processing of tiles and objects

```ts
import * as PIXI from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
import { Tiled } from 'gecs-tiled';
import { loadTiledSpritesheets } from 'gecs-tiled/pixi';
import mapData from './my-map.json';

const tiled = Tiled.from(mapData);
const app = new PIXI.Application();

// load spritesheets referenced in the map
await loadTiledSpritesheets(tiled);

// iterate through each layer
for (const layer of tiled.layers) {
  const tilemap = new CompositeTilemap();
  // layer tiles
  for (const { name, texture, screen, world } of layer.tiles) {
    console.log(`tile ${name} at ${world.x}, ${world.y}`);
    tilemap.tile(texture, screen.x, screen.y);
  }
  // layer objects
  for (const { name, world } of layer.objects) {
    console.log(`object ${name} at ${world.x}, ${world.y}`);
  }

  app.stage.addChild(tilemap);
}

app.render();
```

## API

### Data

```ts
interface TiledTile<T = {}> {
  id: string;
  texture: string;
  tileset: TilesetData;
  layer: TiledLayer;
  world: Vector2;
  screen: Vector2;
  anchor: Vector2;
  offset: Vector2;
  zIndex: number;
  // original value: for tiles, world position
  x: number;
  y: number;
}

interface TiledObject<T = {}> {
  id: string;
  name: string;
  rotation: number;
  layer: TiledLayer;
  type: string;
  visible: boolean;
  height: number;
  width: number;
  zIndex: number;
  // original value: for objects, screen position
  x: number;
  y: number;
}

interface TiledData {
  // root contents of a Tiled JSON export
}

interface LayerData {
  // contents of each object in `map.layers`
}

interface Properties {
  [key: string]: string | number | boolean | null | undefined;
}
```

### Objects

All properties are read-only unless otherwise indicated.

```ts
class Tiled {
  public static from(data: TiledData): Tiled;

  public id: string;
  public tileWidth: number;
  public tileHeight: number;
  public width: number;
  public height: number;

  public objects: TiledObject[];
  public tiles: TiledTile[];
  public tilemap: TiledData;
  public layers: TiledLayer[];
  public tilesets: TilesetData[];
  public atlases: Record<string, SpriteAtlas>;
  public properties: Properties;

  public getTileID(index: number): string;
  public getTileset(index: number): TilesetData;

  public toWorldPoint(screen: Vector2): Vector2;
  public toScreenPoint(world: Vector2): Vector2;
}

class TiledLayer {
  public id: string;
  public type: string;
  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public isVisible: boolean;
  public opacity: number;

  public tiles: TiledTile[];
  public objects: TiledObject[];
  public properties: Properties;
}
```

### Notes & Caveats

- only supports orthographic, standard isometric projections
- requires `Tile Layer Format` to be set to `CSV`