import { Renderable } from "@/game/archetype/renderable";
import { Camera } from "@/game/archetype/camera";
import { Rect } from "@/engine/math/rect";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { EntityOf } from "@/engine/ecs/entity";

function sortRenderable(
  a: EntityOf<typeof Renderable>,
  b: EntityOf<typeof Renderable>,
): number {
  if (a.zIndex && b.zIndex) {
    return a.zIndex.value - b.zIndex.value;
  }

  if (a.zIndex) {
    return 1;
  }

  if (b.zIndex) {
    return -1;
  }

  return 0;
}

export class ImageRenderer implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const renderables = entities
      .queryAllEntities(Renderable)
      .toSorted(sortRenderable);

    ctx.save();

    if (camera) {
      ctx.translate(
        -camera.transform.position.x + ctx.canvas.width / 2,
        -camera.transform.position.y + ctx.canvas.height / 2,
      );
    }

    for (const renderable of renderables) {
      const { transform, drawable } = renderable;
      const { content, size, position, centered, flipX, flipY } = drawable;

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      let x = transform.position.x + position.x;
      let y = transform.position.y + position.y;

      if (centered) {
        x -= size.width / 2;
        y -= size.height / 2;
      }

      if (camera) {
        const viewArea = new Rect(
          camera.transform.position.x - ctx.canvas.width / 2,
          camera.transform.position.y - ctx.canvas.height / 2,
          ctx.canvas.width,
          ctx.canvas.height,
        );

        if (
          !viewArea.overlapsRect({
            x,
            y,
            width: size.width,
            height: size.height,
          })
        ) {
          ctx.restore();
          continue;
        }
      }

      if (flipX) {
        ctx.scale(-1, 1);
        x = -x - size.width;
      }

      if (flipY) {
        ctx.scale(-1, 1);
        y = -y - size.height;
      }

      // TODO check if in view area, otherwise skip
      ctx.drawImage(content, x, y, size.width, size.height);
      ctx.restore();
    }

    ctx.restore();
  }
}
