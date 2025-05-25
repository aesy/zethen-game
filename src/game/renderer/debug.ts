import { Transform2D } from "@/game/component/transform2D";
import { Physical } from "@/game/component/physical";
import { Collidable } from "@/game/component/collidable";
import { Camera } from "@/game/archetype/camera";
import { Canvas } from "@/engine/util/canvas";
import { Rgba } from "@/engine/math/rgba";
import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2Like } from "@/engine/math/pnt2";
import { Circle } from "@/engine/math/circle";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

const PI2 = Math.PI * 2;

export class CameraDebugRenderer implements System {
  private static readonly CAMERA_BOUNDS_COLOR = new Rgba(0, 255, 0, 0.8);

  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const cameras = entities.queryAllEntities(Camera);
    // TODO find active camera
    const activeCamera = cameras.find((_c) => true);

    ctx.save();

    if (activeCamera) {
      const viewMatrix = activeCamera.camera.getViewMatrix(
        activeCamera.transform,
        ctx.canvas,
      );
      Canvas.applyTransform(ctx, viewMatrix.data);
    }

    for (const camera of cameras) {
      ctx.save();

      const modelMatrix = camera.transform.matrix;
      Canvas.applyTransform(ctx, modelMatrix.data);

      ctx.lineWidth = 2;
      ctx.strokeStyle =
        CameraDebugRenderer.CAMERA_BOUNDS_COLOR.toRgbCssString();
      ctx.strokeRect(
        0,
        0,
        camera.camera.safeZone.width,
        camera.camera.safeZone.height,
      );

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(camera.camera.safeZone.width, camera.camera.safeZone.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, camera.camera.safeZone.height);
      ctx.lineTo(camera.camera.safeZone.width, 0);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }
}

export class VelocityDebugRenderer implements System {
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly lengthModifier: number = 1,
  ) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const movables = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("physical", Physical),
    );

    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    if (camera) {
      const viewMatrix = camera.camera.getViewMatrix(
        camera.transform,
        ctx.canvas,
      );
      Canvas.applyTransform(ctx, viewMatrix.data);
    }

    for (const movable of movables) {
      const {
        transform,
        physical: { velocity },
      } = movable;

      if (
        camera &&
        !camera.camera.isPointInView(
          camera.transform,
          transform.position,
          ctx.canvas,
        )
      ) {
        continue;
      }

      ctx.save();

      const modelMatrix = transform.matrix;
      Canvas.applyTransform(ctx, modelMatrix.data);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        velocity.x * this.lengthModifier,
        velocity.y * this.lengthModifier,
      );
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}

export class CollisionDebugRenderer implements System {
  private static readonly INTERSECTION_POINT_COLOR = new Rgba(255, 0, 0, 0.8);
  private static readonly INTERSECTION_BOX_COLOR = new Rgba(255, 0, 0, 0.4);

  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const movables = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("collidable", Collidable),
    );

    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    if (camera) {
      const viewMatrix = camera.camera.getViewMatrix(
        camera.transform,
        ctx.canvas,
      );
      Canvas.applyTransform(ctx, viewMatrix.data);
    }

    // TODO skip if not in view

    for (let i = 0; i < movables.length; i++) {
      const movable1 = movables[i];
      const {
        transform: transform1,
        collidable: { collider: collider1 },
      } = movable1;

      for (let j = i + 1; j < movables.length; j++) {
        const movable2 = movables[j];
        const {
          transform: transform2,
          collidable: { collider: collider2 },
        } = movable2;

        if (collider1 instanceof Circle && collider2 instanceof Circle) {
          const circle1 = Circle.from({
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            radius: collider1.radius * transform1.scale.x,
          });
          const circle2 = Circle.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            radius: collider2.radius * transform2.scale.x,
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
            width: collider1.width * transform1.scale.x,
            height: collider1.height * transform1.scale.y,
          });
          const rect2 = Rect.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            width: collider2.width * transform2.scale.x,
            height: collider2.height * transform2.scale.y,
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
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            radius: collider1.radius * transform1.scale.x,
          });
          const rect = Rect.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            width: collider2.width * transform2.scale.x,
            height: collider2.height * transform2.scale.y,
          });

          const points = Rect.getCircleIntersectionPoints(rect, circle);

          for (const point of points) {
            this.renderIntersectionPoint(point);
          }

          const intersection = Rect.intersectRect(
            rect,
            Circle.getBoundingRect(circle),
          );

          if (intersection) {
            this.renderCollisionBox(intersection);
          }
        } else if (collider1 instanceof Rect && collider2 instanceof Circle) {
          const rect = Rect.from({
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            width: collider1.width * transform1.scale.x,
            height: collider1.height * transform1.scale.y,
          });
          const circle = Circle.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            radius: collider2.radius * transform2.scale.x,
          });

          const points = Rect.getCircleIntersectionPoints(rect, circle);

          for (const point of points) {
            this.renderIntersectionPoint(point);
          }

          const intersection = Rect.intersectRect(
            rect,
            Circle.getBoundingRect(circle),
          );

          if (intersection) {
            this.renderCollisionBox(intersection);
          }
        }
      }
    }

    ctx.restore();
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
    const camera = entities.queryFirstEntity(Camera);
    const movables = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("collidable", Collidable),
    );

    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    if (camera) {
      const viewMatrix = camera.camera.getViewMatrix(
        camera.transform,
        ctx.canvas,
      );
      Canvas.applyTransform(ctx, viewMatrix.data);
    }

    for (const movable of movables) {
      const {
        transform,
        collidable: { collider },
      } = movable;

      ctx.save();

      const modelMatrix = transform.matrix;
      Canvas.applyTransform(ctx, modelMatrix.data);

      if (collider instanceof Circle) {
        ctx.beginPath();
        ctx.arc(collider.x, collider.y, collider.radius, 0, PI2);

        ctx.fillStyle = ColliderDebugRenderer.FILL_COLOR.toRgbCssString();
        ctx.fill();

        ctx.strokeStyle = ColliderDebugRenderer.STROKE_COLOR.toRgbCssString();
        ctx.stroke();
      } else if (collider instanceof Rect) {
        ctx.fillStyle = ColliderDebugRenderer.FILL_COLOR.toRgbCssString();
        ctx.fillRect(collider.x, collider.y, collider.width, collider.height);

        ctx.strokeStyle = ColliderDebugRenderer.STROKE_COLOR.toRgbCssString();
        ctx.strokeRect(collider.x, collider.y, collider.width, collider.height);
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
