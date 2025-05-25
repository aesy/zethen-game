import { Camera } from "@/game/archetype/camera";
import { Box } from "@/game/archetype/box";
import { Ball } from "@/game/archetype/ball";
import { Canvas } from "@/engine/util/canvas";
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
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    if (camera) {
      const viewMatrix = camera.camera.getViewMatrix(
        camera.transform,
        ctx.canvas,
      );
      Canvas.applyTransform(ctx, viewMatrix.data);
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
        transform,
        rectangle: { size, color },
      } = box;

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

      const modelMatrix = transform.matrix;
      Canvas.applyTransform(ctx, modelMatrix.data);

      ctx.fillStyle = color.toRgbCssString();
      ctx.fillRect(0, 0, size.width, size.height);
      ctx.restore();
    }
  }

  private renderBalls(entities: EntityManager): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const balls = entities.queryAllEntities(Ball);

    for (const ball of balls) {
      const {
        transform,
        circle: { radius, color },
      } = ball;

      if (
        camera &&
        !camera.camera.isRectInView(
          camera.transform,
          {
            x: transform.position.x - radius,
            y: transform.position.y - radius,
            width: radius * 2,
            height: radius * 2,
          },
          ctx.canvas,
        )
      ) {
        continue;
      }

      ctx.save();

      const modelMatrix = transform.matrix;
      Canvas.applyTransform(ctx, modelMatrix.data);

      ctx.beginPath();
      ctx.fillStyle = color.toRgbCssString();
      ctx.arc(0, 0, radius, 0, PI2);
      ctx.fill();
      ctx.restore();
    }
  }
}
