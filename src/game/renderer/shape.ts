import { Camera } from "@/game/archetype/camera";
import { Box } from "@/game/archetype/box";
import { Ball } from "@/game/archetype/ball";
import { Rect } from "@/engine/math/rect";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { EntityManager } from "@/engine/ecs/entitymanager";

const PI2 = Math.PI * 2;

export class ShapeRenderer implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);

    ctx.save();

    if (camera) {
      ctx.translate(
        -camera.transform.position.x + ctx.canvas.width / 2,
        -camera.transform.position.y + ctx.canvas.height / 2,
      );
    }

    this.renderBoxes(entities);
    this.renderBalls(entities);

    ctx.restore();
  }

  private renderBoxes(entities: EntityManager): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const boxes = entities.queryAllEntities(Box);

    for (const box of boxes) {
      const {
        transform: { position },
        rectangle: { size, color },
      } = box;

      if (camera) {
        const viewArea = new Rect(
          camera.transform.position.x - ctx.canvas.width / 2,
          camera.transform.position.y - ctx.canvas.height / 2,
          ctx.canvas.width,
          ctx.canvas.height,
        );

        if (
          !viewArea.overlapsRect({
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
          })
        ) {
          continue;
        }
      }

      ctx.fillStyle = color.toRgbCssString();
      ctx.fillRect(position.x, position.y, size.width, size.height);
    }
  }

  private renderBalls(entities: EntityManager): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const balls = entities.queryAllEntities(Ball);

    for (const ball of balls) {
      const {
        transform: { position },
        circle: { radius, color },
      } = ball;

      if (camera) {
        const viewArea = new Rect(
          camera.transform.position.x - ctx.canvas.width / 2,
          camera.transform.position.y - ctx.canvas.height / 2,
          ctx.canvas.width,
          ctx.canvas.height,
        );

        if (
          !viewArea.overlapsRect({
            x: position.x - radius,
            y: position.y - radius,
            width: radius * 2,
            height: radius * 2,
          })
        ) {
          continue;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = color.toRgbCssString();
      ctx.arc(position.x, position.y, radius, 0, PI2);
      ctx.fill();
    }
  }
}
