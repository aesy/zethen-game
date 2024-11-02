import grassImg from "@/game/experimental/TX Tileset Grass.png";
import { loadImage } from "@/engine/util/image";
import { Arrays } from "@/engine/util/arrays";
import { TileSet } from "@/engine/image/tileset";
import { TileMap } from "@/engine/image/tilemap";
import { TileLayer } from "@/engine/image/tilelayer";
import { Tile } from "@/engine/image/tile";
import { SpriteSheet } from "@/engine/image/spritesheet";

export async function createTileMap(): Promise<[TileMap, TileSet]> {
  const image = await loadImage(grassImg);
  const grassSpritesheet = await SpriteSheet.fromFixedGrid(image, {
    gridSize: { width: 16, height: 16 },
  });
  const tileSet = new TileSet({
    a: grassSpritesheet[7][0],
    b: grassSpritesheet[7][1],
    c: grassSpritesheet[7][2],
    d: grassSpritesheet[7][3],
    e: grassSpritesheet[7][4],
    f: grassSpritesheet[7][5],
    g: grassSpritesheet[7][6],
    h: grassSpritesheet[7][7],
    i: grassSpritesheet[7][8],
    j: grassSpritesheet[7][9],
    k: grassSpritesheet[7][10],
    l: grassSpritesheet[7][11],
    m: grassSpritesheet[7][12],
    n: grassSpritesheet[7][13],
    o: grassSpritesheet[7][14],
    p: grassSpritesheet[7][15],
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
    { name: "i" },
    { name: "j" },
    { name: "k" },
    { name: "l" },
    { name: "m" },
    { name: "n" },
    { name: "o" },
    { name: "p" },
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
