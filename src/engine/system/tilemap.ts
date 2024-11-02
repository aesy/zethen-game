import { System } from "@/engine/system/index";
import { Rect } from "@/engine/math/rect";
import { Dim2 } from "@/engine/math/dim2";
import { TileSet } from "@/engine/image/tileset";
import { TileMap } from "@/engine/image/tilemap";
import { Scene } from "@/engine/game/scene";
import { EntityId } from "@/engine/entity";
import { ZIndex } from "@/engine/component/zindex";
import { Transform2D } from "@/engine/component/transform2D";
import { Drawable } from "@/engine/component/drawable";
import { Tile } from "@/engine/archetype/tile";
import { Pnt2 } from "../math/pnt2";

const GRID_SIZE = 64;

export class TileMapSystem implements System {
  private readonly tiles: EntityId[] = [];

  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly tileMap: TileMap,
    private readonly tileSet: TileSet,
  ) {}

  public init({ entities }: Scene): void {
    for (let y = 0; y < this.tileMap.height; y++) {
      for (let x = 0; x < this.tileMap.width; x++) {
        const tile = this.tileMap.getTile("ground", { x, y });

        if (tile) {
          const image = this.tileSet.getTile(tile.name);

          if (image) {
            const drawable = new Drawable(
              image,
              Pnt2.zero(),
              new Dim2(GRID_SIZE, GRID_SIZE),
            );
            drawable.centered = false;
            const transform = new Transform2D(
              new Pnt2(x * GRID_SIZE, y * GRID_SIZE),
            );

            const entity = entities.createArchetype(Tile, {
              transform,
              drawable,
              zIndex: new ZIndex(1),
            });
            this.tiles.push(entity);
          }
        }
      }
    }
  }

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const viewArea = new Rect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const tile of this.tiles) {
      const drawable = entities.getFirstComponent(tile, Drawable);
      const transform = entities.getFirstComponent(tile, Transform2D);

      if (drawable && transform) {
        const outsideViewArea = !viewArea.containsPoint(transform.position);

        if (outsideViewArea) {
          entities.removeComponent(tile, drawable);
        }
      }
    }

    for (let y = 0; y < this.tileMap.height; y++) {
      for (let x = 0; x < this.tileMap.width; x++) {
        const tile = this.tileMap.getTile("ground", { x, y });

        if (tile) {
          const image = this.tileSet.getTile(tile.name);

          if (image) {
            const position = new Pnt2(x * GRID_SIZE, y * GRID_SIZE);
            const entity = this.tiles.find((tile) => {
              const transform = entities.getFirstComponent(tile, Transform2D);

              return transform && transform.position.equals(position);
            });

            if (entity) {
              const drawable = entities.getFirstComponent(entity, Drawable);
              const transform = entities.getFirstComponent(entity, Transform2D);
              const inView = viewArea.containsPoint(transform!.position);

              if (!inView || drawable) {
                continue;
              }
            }

            const drawable = new Drawable(
              image,
              Pnt2.zero(),
              new Dim2(GRID_SIZE, GRID_SIZE),
            );
            drawable.centered = false;

            if (entity) {
              entities.addComponent(entity, drawable);
            } else {
              const transform = new Transform2D(position);

              entities.createArchetype(Tile, { transform, drawable });
            }
          }
        }
      }
    }
  }
}
