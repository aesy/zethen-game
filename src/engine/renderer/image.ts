import { System } from "@/engine/system";
import { Scene } from "@/engine/game/scene";
import { Renderable } from "@/engine/archetype/renderable";

export class ImageRenderer implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const renderables = entities.queryAllEntities(Renderable);

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
