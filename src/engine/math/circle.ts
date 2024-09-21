import { Vector2 } from "@/engine/math/vector";
import { Rect } from "@/engine/math/rect";
import { Point2, Point } from "@/engine/math/point";

export interface Circle {
  center: Point2;
  radius: number;
}

export namespace Circle {
  export function isInstance(obj: unknown): obj is Circle {
    if (obj && typeof obj === "object") {
      return obj.hasOwnProperty("center") && obj.hasOwnProperty("radius");
    }

    return false;
  }

  export function getClosestPoint(circle: Circle, point: Point2): Point2 {
    const edgeOffset = Vector2.fromPoint(point)
      .subtract(circle.center)
      .normalize()
      .multiplyScalar(circle.radius);

    return Point.add(circle.center, edgeOffset);
  }

  export function containsPoint(circle: Circle, point: Point2): boolean {
    const distanceSquared = Point.distanceSquared(circle.center, point);
    const radiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared <= radiusSquared;
  }

  export function containsRect(circle: Circle, rect: Rect): boolean {
    const dx = Math.max(
      circle.center.x - Rect.getLeft(rect),
      Rect.getRight(rect) - circle.center.x,
    );
    const dy = Math.max(
      circle.center.y - Rect.getTop(rect),
      Rect.getBottom(rect) - circle.center.y,
    );
    const distanceSquared = Math.pow(dx, 2) + Math.pow(dy, 2);
    const radiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared <= radiusSquared;
  }

  export function containsCircle(circle: Circle, other: Circle): boolean {
    const distanceSquared = Point.distanceSquared(circle.center, other.center);
    const otherRadiusSquared = Math.pow(other.radius, 2);
    const thisRadiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared + otherRadiusSquared <= thisRadiusSquared;
  }

  export function overlapsRect(circle: Circle, rect: Rect): boolean {
    return Rect.overlapsCircle(rect, circle);
  }

  export function overlapsCircle(circle: Circle, other: Circle): boolean {
    const distanceSquared = Point.distanceSquared(circle.center, other.center);
    const radiusSumSquared = Math.pow(circle.radius + other.radius, 2);

    return distanceSquared <= radiusSumSquared;
  }

  export function getBoundingRect(circle: Circle): Rect {
    const position = {
      x: circle.center.x - circle.radius,
      y: circle.center.y - circle.radius,
    };
    const diameter = circle.radius * 2;
    const size = { width: diameter, height: diameter };

    return { position, size };
  }
}
