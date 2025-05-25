import { Renderable } from "@/game/archetype/renderable";
import { Camera } from "@/game/archetype/camera";
import { Canvas } from "@/engine/util/canvas";
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
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    if (camera) {
      const viewMatrix = camera.camera.getViewMatrix(
        camera.transform,
        ctx.canvas,
      );
      Canvas.applyTransform(ctx, viewMatrix.data);
    }

    for (const renderable of renderables) {
      const { transform, drawable } = renderable;
      const { content, size, position, flipX, flipY } = drawable;

      if (
        camera &&
        !camera.camera.isRectInView(
          camera.transform,
          { ...transform.position, ...size },
          ctx.canvas,
        )
      ) {
        continue;
      }

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      const modelMatrix = transform.matrix;
      Canvas.applyTransform(ctx, modelMatrix.data);

      if (flipX) {
        ctx.scale(-1, 1);
      }

      if (flipY) {
        ctx.scale(1, -1);
      }

      ctx.drawImage(content, position.x, position.y, size.width, size.height);
      ctx.restore();
    }

    ctx.restore();
  }
}
