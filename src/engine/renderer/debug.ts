import { System } from "@/engine/system";
import { Vector2 } from "@/engine/math/vector";
import { Rect } from "@/engine/math/rect";
import { Point } from "@/engine/math/point";
import { Color } from "@/engine/math/color";
import { Collision } from "@/engine/math/collision";
import { Circle } from "@/engine/math/circle";
import { Scene } from "@/engine/game/scene";
import { Query } from "@/engine/entity/query";
import { Transform } from "@/engine/component/transform";
import { Collidable } from "@/engine/component/collidable";
import { Movable } from "@/engine/archetype/movable";

const PI2 = Math.PI * 2;

export class VelocityDebugRenderer implements System {
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly lengthModifier: number = 1,
  ) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const movables = entities
      .queryAllEntities(Movable)
      .filter((movable) => Boolean(movable.physical));

    for (const movable of movables) {
      const {
        transform: { position },
        physical,
      } = movable;
      const { velocity } = physical!;

      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
      ctx.lineCap = "butt";

      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(
        position.x + velocity.x * this.lengthModifier,
        position.y + velocity.y * this.lengthModifier,
      );
      ctx.stroke();
    }
  }
}

export class CollisionDebugRenderer implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const movables = entities
      .queryAllEntities(Movable)
      .filter((movable) => Boolean(movable.collidable));

    for (let i = 0; i < movables.length; i++) {
      const movable1 = movables[i];
      const { transform: transform1, collidable: collidable1 } = movable1;
      const { collider: collider1 } = collidable1!;

      for (let j = i + 1; j < movables.length; j++) {
        const movable2 = movables[j];
        const { transform: transform2, collidable: collidable2 } = movable2;
        const { collider: collider2 } = collidable2!;

        if (Circle.isInstance(collider1) && Circle.isInstance(collider2)) {
          const circle1 = {
            center: Point.add(collider1.center, transform1.position),
            radius: collider1.radius * transform1.scale.width,
          } satisfies Circle;
          const circle2 = {
            center: Point.add(collider2.center, transform2.position),
            radius: collider2.radius * transform2.scale.width,
          } satisfies Circle;

          if (Circle.overlapsCircle(circle1, circle2)) {
            this.renderCollision({
              position: circle1.center,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
            this.renderCollision({
              position: circle2.center,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
          }
        } else if (Rect.isInstance(collider1) && Rect.isInstance(collider2)) {
          const rect1 = {
            position: Point.add(collider1.position, transform1.position),
            size: {
              width: collider1.size.width * transform1.scale.width,
              height: collider1.size.height * transform1.scale.height,
            },
          } satisfies Rect;
          const rect2 = {
            position: Point.add(collider2.position, transform2.position),
            size: {
              width: collider2.size.width * transform2.scale.width,
              height: collider2.size.height * transform2.scale.height,
            },
          } satisfies Rect;

          if (Rect.overlapsRect(rect1, rect2)) {
            this.renderCollision({
              position: rect1.position,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
            this.renderCollision({
              position: rect2.position,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
          }
        } else if (Circle.isInstance(collider1) && Rect.isInstance(collider2)) {
          const circle = {
            center: Point.add(collider1.center, transform1.position),
            radius: collider1.radius * transform1.scale.width,
          } satisfies Circle;
          const rect = {
            position: Point.add(collider2.position, transform2.position),
            size: {
              width: collider2.size.width * transform2.scale.width,
              height: collider2.size.height * transform2.scale.height,
            },
          } satisfies Rect;

          if (Circle.overlapsRect(circle, rect)) {
            this.renderCollision({
              position: circle.center,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
            this.renderCollision({
              position: rect.position,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
          }
        } else if (Rect.isInstance(collider1) && Circle.isInstance(collider2)) {
          const rect = {
            position: Point.add(collider1.position, transform1.position),
            size: {
              width: collider1.size.width * transform1.scale.width,
              height: collider1.size.height * transform1.scale.height,
            },
          } satisfies Rect;
          const circle = {
            center: Point.add(collider2.center, transform2.position),
            radius: collider2.radius * transform2.scale.width,
          } satisfies Circle;

          if (Rect.overlapsCircle(rect, circle)) {
            this.renderCollision({
              position: rect.position,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
            this.renderCollision({
              position: circle.center,
              normal: Vector2.zero(),
              direction: Vector2.zero(),
            });
          }
        }
      }
    }
  }

  private handleCircleCircleCollision(): void {}

  private handleRectRectCollision(): void {}

  private handleCircleRectCollision(): void {}

  private renderCollision(collision: Collision): void {
    const ctx = this.context;
    const { position } = collision;

    ctx.beginPath();
    ctx.fillStyle = "purple";
    ctx.arc(position.x, position.y, 20, 0, PI2);
    ctx.fill();
  }
}

export class ColliderDebugRenderer implements System {
  private static readonly COLOR = Color.fromRGB(128, 0, 128, 0.5);

  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const movables = entities
      .queryAllEntities(
        Query.create()
          .single("transform", Transform)
          .single("collidable", Collidable),
      )
      .filter((movable) => Boolean(movable.collidable));

    for (const movable of movables) {
      const { transform, collidable } = movable;
      const { collider } = collidable!;

      if (Circle.isInstance(collider)) {
        const circle = {
          center: Point.add(collider.center, transform.position),
          radius: collider.radius * transform.scale.width,
        } satisfies Circle;

        ctx.beginPath();
        ctx.fillStyle = ColliderDebugRenderer.COLOR.toString();
        ctx.arc(circle.center.x, circle.center.y, 20, 0, PI2);
        ctx.fill();
      } else if (Rect.isInstance(collider)) {
        const rect = {
          position: Point.add(collider.position, transform.position),
          size: {
            width: collider.size.width * transform.scale.width,
            height: collider.size.height * transform.scale.height,
          },
        } satisfies Rect;

        ctx.fillStyle = ColliderDebugRenderer.COLOR.toString();
        ctx.strokeStyle = ColliderDebugRenderer.COLOR.toString();
        ctx.strokeRect(
          rect.position.x,
          rect.position.y,
          rect.size.width,
          rect.size.height,
        );
      }
    }
  }
}
