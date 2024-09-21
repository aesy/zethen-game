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
      const { content, size, position } = drawable;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        content,
        transform.position.x + position.x - size.width / 2,
        transform.position.y + position.y - size.height / 2,
        size.width,
        size.height,
      );
    }
  }
}
