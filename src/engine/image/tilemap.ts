import { RectLike } from "@/engine/math/rect";
import { Pnt2Like } from "@/engine/math/pnt2";
import { TileLayer } from "@/engine/image/tilelayer";
import { Tile } from "@/engine/image/tile";

export class TileMap<T extends string = string> {
  private static readonly DEFAULT_LAYER = "__DEFAULT_LAYER";

  private readonly indices: Map<T, number> = new Map();

  constructor(
    public readonly width: number,
    public readonly height: number,
    private readonly layers: TileLayer<T>[],
  ) {
    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index];
      this.indices.set(layer.name, index);
    }
  }

  public static withSingleLayer(
    map: (Tile | null)[][],
  ): TileMap<"__DEFAULT_LAYER"> {
    return new TileMap(map[0]?.length ?? 0, map.length, [
      new TileLayer(TileMap.DEFAULT_LAYER, map),
    ]);
  }

  public getLayer(name: T): TileLayer<T> | null {
    const index = this.indices.get(name);

    if (index === undefined) {
      return null;
    }

    return this.layers[index] ?? null;
  }

  public getTile(layerName: T, pos: Readonly<Pnt2Like>): Tile | null {
    const layer = this.getLayer(layerName);

    if (layer === null) {
      return null;
    }

    return layer.getTile(pos);
  }

  public getSection(rect: Readonly<RectLike>): TileMap<T> {
    throw new Error("Not implemented");
  }

  public getTiles(pos: Readonly<Pnt2Like>): Tile[] {
    const tiles: Tile[] = [];

    for (const layer of this.layers) {
      const tile = layer.getTile(pos);

      if (tile === null) {
        continue;
      }

      tiles.push(tile);
    }

    return tiles;
  }

  public *[Symbol.iterator](): Iterator<Tile> {
    for (const layer of this.layers) {
      for (const tile of layer) {
        yield tile;
      }
    }
  }
}
