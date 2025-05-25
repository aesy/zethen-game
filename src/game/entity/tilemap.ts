import { loadImage } from "@/engine/util/image";
import { Arrays } from "@/engine/util/arrays";
import { TileSet } from "@/engine/image/tileset";
import { TileMap } from "@/engine/image/tilemap";
import { TileLayer } from "@/engine/image/tilelayer";
import { Tile } from "@/engine/image/tile";
import { SpriteSheet } from "@/engine/image/spritesheet";
import tileMapImage from "@/assets/sprites/tilemap.png";

export async function createTileMap(): Promise<[TileMap, TileSet]> {
  const image = await loadImage(tileMapImage);
  const grassSpritesheet = await SpriteSheet.fromFixedGrid(image, {
    gridSize: { width: 32, height: 32 },
  });
  const tileSet = new TileSet({
    a: grassSpritesheet[3][0],
    b: grassSpritesheet[3][1],
    c: grassSpritesheet[3][2],
    d: grassSpritesheet[3][3],
    e: grassSpritesheet[3][4],
    f: grassSpritesheet[3][5],
    g: grassSpritesheet[3][6],
    h: grassSpritesheet[3][7],
  });
  const tiles = [
    { name: "a" },
    { name: "b" },
    { name: "c" },
    { name: "d" },
    { name: "e" },
    { name: "f" },
    { name: "g" },
    { name: "h" },
  ] satisfies Tile[];
  const tileMap = new TileMap(32, 16, [
    new TileLayer(
      "ground",
      new Array(16)
        .fill(null)
        .map(() =>
          new Array(32).fill(null).map(() => Arrays.pickRandom(tiles)),
        ),
    ),
  ]);

  return [tileMap, tileSet];
}
