import type { Tiled } from '../lib/Tiled';
import type { Atlas, AtlasFrame, TilesetData } from '../types';

import * as PIXI from 'pixi.js';

import { getAtlasFromTileset } from '.';
import { _ } from './misc';

export async function loadSpritesheetFromURL(
  url: string,
  atlas: Atlas
): Promise<PIXI.Spritesheet> {
  const texture = await PIXI.Texture.fromURL(url);
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  return loadSpritesheetFromTexture(texture, atlas);
}

export async function loadSpritesheetFromTexture(
  texture: PIXI.Texture,
  atlas: Atlas
): Promise<PIXI.Spritesheet> {
  const frames: Record<string, AtlasFrame> = {};
  const name = atlas.meta.name;
  for (const [key, value] of _.entries(atlas.frames)) {
    frames[`${name}.${key}`] = value;
  }

  const sheet = new PIXI.Spritesheet(texture, { ...atlas, frames });
  return sheet.parse().then(() => sheet);
}

export async function loadSpritesheetsFromAtlas(
  atlas: Atlas
): Promise<PIXI.Spritesheet[]> {
  const images: string[] = Array.isArray(atlas.meta.image)
    ? atlas.meta.image
    : [atlas.meta.image];

  return Promise.all(images.map(url => loadSpritesheetFromURL(url, atlas)));
}

export async function loadSpritesheetsFromTilesets(
  tilesets: TilesetData[]
): Promise<Record<string, PIXI.Spritesheet>> {
  const res = await Promise.all(
    tilesets.map(async tileset => {
      const atlas = getAtlasFromTileset(tileset);
      // we may have already loaded the texture. don't reload it.
      const texture = PIXI.utils.TextureCache[tileset.image];
      const sprites = await (texture
        ? loadSpritesheetFromURL(tileset.image, atlas)
        : loadSpritesheetFromTexture(texture, atlas));

      return { atlas, sprites };
    })
  );

  return res.reduce((a, b) => ({ ...a, [b.atlas.meta.name]: b.sprites }), {});
}

export function loadTiledSpritesheets(
  tiled: Tiled
): Promise<Record<string, PIXI.Spritesheet>> {
  return loadSpritesheetsFromTilesets(tiled.tilesets);
}
