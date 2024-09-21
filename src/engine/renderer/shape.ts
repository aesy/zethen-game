import { System } from "@/engine/system";
import { Scene } from "@/engine/game/scene";
import { EntityManager } from "@/engine/entity/manager";
import { Box } from "@/engine/archetype/box";
import { Ball } from "@/engine/archetype/ball";

const PI2 = Math.PI * 2;

export class ShapeRenderer implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    this.clear();
    this.renderBoxes(entities);
    this.renderBalls(entities);
  }

  private clear(): void {
    const ctx = this.context;
    const canvas = ctx.canvas;

    // TODO use clearRect instead
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private renderBoxes(entities: EntityManager): void {
    const ctx = this.context;
    const boxes = entities.queryAllEntities(Box);

    for (const box of boxes) {
      const {
        transform: { position },
        rectangle: { size, color },
      } = box;
      ctx.fillStyle = color.toString();
      ctx.fillRect(position.x, position.y, size.width, size.height);
    }
  }

  private renderBalls(entities: EntityManager): void {
    const ctx = this.context;
    const balls = entities.queryAllEntities(Ball);

    for (const ball of balls) {
      const {
        transform: { position },
        circle: { radius, color },
      } = ball;

      ctx.beginPath();
      ctx.fillStyle = color.toString();
      ctx.arc(position.x, position.y, radius, 0, PI2);
      ctx.fill();
    }
  }
}
