import { Transform2D } from "@/game/component/transform2D";
import { Drawable } from "@/game/component/drawable";
import { Collidable } from "@/game/component/collidable";
import { Tile } from "@/game/archetype/tile";
import { Camera } from "@/game/archetype/camera";
import { Rect } from "@/engine/math/rect";
import { Pnt2 } from "@/engine/math/pnt2";
import { Dim2 } from "@/engine/math/dim2";
import { TileSet } from "@/engine/image/tileset";
import { TileMap } from "@/engine/image/tilemap";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { EntityId } from "@/engine/ecs/entity";

const GRID_SIZE = 128;

export class TileMapSystem implements System {
  private readonly tiles: EntityId[] = [];

  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly tileMap: TileMap,
    private readonly tileSet: TileSet,
  ) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);

    for (const tile of this.tiles) {
      const drawable = entities.getFirstComponent(tile, Drawable);
      const transform = entities.getFirstComponent(tile, Transform2D);

      if (camera && drawable && transform) {
        const inView = camera.camera.isRectInView(
          camera.transform,
          {
            x: transform.position.x,
            y: transform.position.y,
            width: GRID_SIZE,
            height: GRID_SIZE,
          },
          ctx.canvas,
        );

        if (!inView) {
          if (entities.getFirstComponent(tile, Collidable)) {
            entities.removeComponent(tile, drawable);
          } else {
            entities.deleteEntity(tile);
          }
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

            if (camera) {
              const inView = camera.camera.isRectInView(
                camera.transform,
                {
                  x: position.x,
                  y: position.y,
                  width: GRID_SIZE,
                  height: GRID_SIZE,
                },
                ctx.canvas,
              );

              if (!inView) {
                continue;
              }
            }

            const entity = this.tiles.find((tile) => {
              const transform = entities.getFirstComponent(tile, Transform2D);

              return transform && transform.position.equals(position);
            });

            if (entity !== undefined) {
              const drawable = entities.getFirstComponent(entity, Drawable);

              if (drawable) {
                continue;
              }
            }

            const drawable = new Drawable(
              image,
              Pnt2.zero(),
              new Dim2(GRID_SIZE, GRID_SIZE),
            );

            if (entity === undefined) {
              const transform = new Transform2D(position);

              const tile = entities.createArchetype(Tile, {
                transform,
                drawable,
              });
              this.tiles.push(tile);
            } else {
              entities.addComponent(entity, drawable);
            }
          }
        }
      }
    }
  }
}
