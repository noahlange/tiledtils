import type { TiledLayer } from '../lib/TiledLayer';
import type { AtlasFrame, Vector2 } from '../types';
import type {
  Properties,
  Property,
  SansProperties,
  WithProperties
} from './properties';

export interface TilesetData {
  firstgid: number;
  columns: number;
  source?: string;
  grid?: {
    height: number;
    width: number;
    orientation: string;
  };
  image: string;
  imageheight: number;
  imagewidth: number;
  tilewidth: number;
  tileheight: number;
  tilecount: number;
  tiledversion?: string;
  margin: number;
  tileoffset?: Vector2;
  name: string;
  tiles?: WithProperties<{ id: string }>[];
}

export interface ObjectData {
  id: string;
  name: string;
  rotation: number;
  type: string;
  visible: boolean;
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface LayerData {
  // in CSV export mode
  data?: number[];
  objects?: WithProperties<ObjectData>[];
  height?: number;
  width?: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  x: number;
  y: number;
}

export interface TiledData {
  height: number;
  width: number;
  layers: LayerData[];
  tilesets: TilesetData[];
  nextobjectid: number;
  orientation: 'isometric' | 'orthographic';
  properties?: Property[];
  renderorder: string;
  tileheight: number;
  tilewidth: number;
  version: string;
}

interface BaseData extends Vector2 {
  world: Vector2;
  screen: Vector2;
  layer: TiledLayer;
  zIndex: number;
  properties: Properties;
}

export type TiledObject = SansProperties<ObjectData> & BaseData;

export interface TiledTile extends AtlasFrame, BaseData {
  texture: string;
  tileset: TilesetData;
  offset: Vector2;
  anchor: Vector2;
}
