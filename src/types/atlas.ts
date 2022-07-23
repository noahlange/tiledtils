import type { Size, Vector2 } from '../types';
import type { Properties } from './properties';

export interface AtlasFrame {
  id?: string;
  frame: Vector2 & Size;
  offset?: Vector2;
  anchor?: Vector2;
  properties: Properties;
}

export interface AtlasMeta {
  name: string;
  image: string | string[];
  scale: string;
  size: Size;
}

export interface Atlas {
  id: string;
  meta: AtlasMeta;
  frames: Record<string, AtlasFrame>;
  animations: Record<string, string[]>;
}
