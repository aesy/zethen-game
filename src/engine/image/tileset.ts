export class TileSet<T extends string = string> {
  public constructor(
    private readonly tiles: Readonly<Record<T, CanvasImageSource>>,
  ) {}

  public getTile(name: T): CanvasImageSource | null {
    return this.tiles[name] ?? null;
  }
}
