import { Renderable } from "@/game/archetype/renderable";
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
    const renderables = entities
      .queryAllEntities(Renderable)
      .toSorted(sortRenderable);

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

      if (flipX) {
        ctx.scale(-1, 1);
        x = -x - size.width;
      }

      if (flipY) {
        ctx.scale(-1, 1);
        y = -y - size.height;
      }

      ctx.drawImage(content, x, y, size.width, size.height);
      ctx.restore();
    }
  }
}
