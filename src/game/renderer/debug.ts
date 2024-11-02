import { Transform2D } from "@/game/component/transform2D";
import { Collidable } from "@/game/component/collidable";
import { Movable } from "@/game/archetype/movable";
import { Rgba } from "@/engine/math/rgba";
import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2Like } from "@/engine/math/pnt2";
import { Circle } from "@/engine/math/circle";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

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
  private static readonly INTERSECTION_POINT_COLOR = new Rgba(255, 0, 0, 0.8);
  private static readonly INTERSECTION_BOX_COLOR = new Rgba(255, 0, 0, 0.4);

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

        if (collider1 instanceof Circle && collider2 instanceof Circle) {
          const circle1 = Circle.from({
            center: collider1.center.clone().add(transform1.position),
            radius: collider1.radius * transform1.scale.width,
          });
          const circle2 = Circle.from({
            center: collider2.center.clone().add(transform2.position),
            radius: collider2.radius * transform2.scale.width,
          });

          const points = Circle.getCircleIntersectionPoints(circle1, circle2);

          for (const point of points) {
            this.renderIntersectionPoint(point);
          }

          const intersection = Circle.intersectCircle(circle1, circle2);

          if (intersection) {
            this.renderCollisionBox(intersection);
          }
        } else if (collider1 instanceof Rect && collider2 instanceof Rect) {
          const rect1 = Rect.from({
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            width: collider1.width * transform1.scale.width,
            height: collider1.height * transform1.scale.height,
          });
          const rect2 = Rect.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            width: collider2.width * transform2.scale.width,
            height: collider2.height * transform2.scale.height,
          });

          const points = Rect.getRectIntersectionPoints(rect1, rect2);

          for (const point of points) {
            this.renderIntersectionPoint(point);
          }

          const intersection = Rect.intersectRect(rect1, rect2);

          if (intersection) {
            this.renderCollisionBox(intersection);
          }
        } else if (collider1 instanceof Circle && collider2 instanceof Rect) {
          const circle = Circle.from({
            center: collider1.center.clone().add(transform1.position),
            radius: collider1.radius * transform1.scale.width,
          });
          const rect = Rect.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            width: collider2.width * transform2.scale.width,
            height: collider2.height * transform2.scale.height,
          });

          const points = Rect.getCircleIntersectionPoints(rect, circle);

          for (const point of points) {
            this.renderIntersectionPoint(point);
          }

          const intersection = Rect.intersectCircle(rect, circle);

          if (intersection) {
            this.renderCollisionBox(intersection);
          }
        } else if (collider1 instanceof Rect && collider2 instanceof Circle) {
          const rect = Rect.from({
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            width: collider1.width * transform1.scale.width,
            height: collider1.height * transform1.scale.height,
          });
          const circle = Circle.from({
            center: collider2.center.clone().add(transform2.position),
            radius: collider2.radius * transform2.scale.width,
          });

          const points = Rect.getCircleIntersectionPoints(rect, circle);

          for (const point of points) {
            this.renderIntersectionPoint(point);
          }

          const intersection = Rect.intersectCircle(rect, circle);

          if (intersection) {
            this.renderCollisionBox(intersection);
          }
        }
      }
    }
  }

  private handleCircleCircleCollision(): void {}

  private handleRectRectCollision(): void {}

  private handleCircleRectCollision(): void {}

  private renderIntersectionPoint(point: Readonly<Pnt2Like>): void {
    const ctx = this.context;

    ctx.beginPath();
    ctx.fillStyle =
      CollisionDebugRenderer.INTERSECTION_POINT_COLOR.toRgbCssString();
    ctx.arc(point.x, point.y, 4, 0, PI2);
    ctx.fill();
  }

  private renderCollisionBox(rect: Readonly<RectLike>): void {
    const ctx = this.context;

    ctx.beginPath();
    ctx.fillStyle =
      CollisionDebugRenderer.INTERSECTION_BOX_COLOR.toRgbCssString();
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }
}

export class ColliderDebugRenderer implements System {
  private static readonly STROKE_COLOR = new Rgba(128, 0, 128, 0.5);
  private static readonly FILL_COLOR = new Rgba(128, 0, 128, 0.2);

  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const movables = entities
      .queryAllEntities(
        Query.create()
          .single("transform", Transform2D)
          .single("collidable", Collidable),
      )
      .filter((movable) => Boolean(movable.collidable));

    for (const movable of movables) {
      const { transform, collidable } = movable;
      const { collider } = collidable!;

      if (collider instanceof Circle) {
        const circle = Circle.from({
          center: collider.center.clone().add(transform.position),
          radius: collider.radius * transform.scale.width,
        });

        ctx.beginPath();
        ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, PI2);

        ctx.fillStyle = ColliderDebugRenderer.FILL_COLOR.toRgbCssString();
        ctx.fill();

        ctx.strokeStyle = ColliderDebugRenderer.STROKE_COLOR.toRgbCssString();
        ctx.stroke();
      } else if (collider instanceof Rect) {
        const rect = Rect.from({
          x: collider.x + transform.position.x,
          y: collider.y + transform.position.y,
          width: collider.width * transform.scale.width,
          height: collider.height * transform.scale.height,
        });

        ctx.fillStyle = ColliderDebugRenderer.FILL_COLOR.toRgbCssString();
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        ctx.strokeStyle = ColliderDebugRenderer.STROKE_COLOR.toRgbCssString();
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      }
    }
  }
}
