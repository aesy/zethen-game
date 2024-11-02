import { Pnt2Like } from "@/engine/math/pnt2";
import { Tile } from "@/engine/image/tile";

export class TileLayer<T extends string = string> {
  public constructor(
    public readonly name: T,
    private readonly tiles: (Tile | null)[][],
  ) {}

  public getTile(pos: Readonly<Pnt2Like>): Tile | null {
    return this.tiles[pos.y]?.[pos.x] ?? null;
  }

  *[Symbol.iterator](): Iterator<Tile> {
    for (const row of this.tiles) {
      for (const column of row) {
        if (column != null) {
          yield column;
        }
      }
    }
  }
}
