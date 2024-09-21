import { clamp } from "@/engine/math/util";
import { Point2, Point } from "@/engine/math/point";
import { Dimension2 } from "@/engine/math/dimension";
import { Circle } from "@/engine/math/circle";

export interface Rect {
  position: Point2;
  size: Dimension2;
}

export namespace Rect {
  export function isInstance(obj: unknown): obj is Rect {
    if (obj && typeof obj === "object") {
      return obj.hasOwnProperty("position") && obj.hasOwnProperty("size");
    }

    return false;
  }

  export function getCenter(rect: Rect): Point2 {
    return {
      x: rect.position.x + rect.size.width / 2,
      y: rect.position.y + rect.size.height / 2,
    };
  }

  export function getLeft(rect: Rect): number {
    return rect.position.x;
  }

  export function getRight(rect: Rect): number {
    return rect.position.x + rect.size.width;
  }

  export function getTop(rect: Rect): number {
    return rect.position.y;
  }

  export function getBottom(rect: Rect): number {
    return rect.position.y + rect.size.height;
  }

  export function getTopLeft(rect: Rect): Point2 {
    return { x: getLeft(rect), y: getTop(rect) };
  }

  export function getTopRight(rect: Rect): Point2 {
    return { x: getRight(rect), y: getTop(rect) };
  }

  export function getBottomLeft(rect: Rect): Point2 {
    return { x: getLeft(rect), y: getBottom(rect) };
  }

  export function getBottomRight(rect: Rect): Point2 {
    return { x: getRight(rect), y: getBottom(rect) };
  }

  export function getClosestPoint(rect: Rect, point: Point2): Point2 {
    if (containsPoint(rect, point)) {
      const distanceTopLeft = Point.subtract(point, getTopLeft(rect));
      const distanceBottomRight = Point.subtract(getBottomRight(rect), point);
      const xMin = Math.min(distanceTopLeft.x, distanceBottomRight.x);
      const yMin = Math.min(distanceTopLeft.y, distanceBottomRight.y);
      const distanceMin = Math.min(xMin, yMin);
      const result = { ...point };

      if (distanceMin === distanceTopLeft.x) {
        result.x = getLeft(rect);
      } else if (distanceMin === distanceBottomRight.x) {
        result.x = getRight(rect);
      }

      if (distanceMin === distanceTopLeft.y) {
        result.y = getTop(rect);
      } else if (distanceMin === distanceBottomRight.y) {
        result.y = getBottom(rect);
      }

      return result;
    }

    return {
      x: clamp(point.x, getLeft(rect), getRight(rect)),
      y: clamp(point.y, getTop(rect), getBottom(rect)),
    };
  }

  export function containsPoint(rect: Rect, point: Point2): boolean {
    return (
      point.x >= getLeft(rect) &&
      point.x <= getRight(rect) &&
      point.y >= getTop(rect) &&
      point.y <= getBottom(rect)
    );
  }

  export function containsRect(rect1: Rect, rect2: Rect): boolean {
    return (
      getLeft(rect2) >= getLeft(rect1) &&
      getRight(rect2) <= getRight(rect1) &&
      getTop(rect2) >= getTop(rect1) &&
      getBottom(rect2) <= getBottom(rect1)
    );
  }

  export function containsCircle(rect: Rect, circle: Circle): boolean {
    if (!containsPoint(rect, circle.center)) {
      return false;
    }

    const closestPoint = getClosestPoint(rect, circle.center);
    const distanceSquared = Point.distanceSquared(closestPoint, circle.center);
    const radiusSquared = Math.pow(circle.radius, 2);

    return radiusSquared <= distanceSquared;
  }

  export function overlapsRect(rect1: Rect, rect2: Rect): boolean {
    return (
      getLeft(rect2) <= getRight(rect1) &&
      getRight(rect2) >= getLeft(rect1) &&
      getTop(rect2) <= getBottom(rect1) &&
      getBottom(rect2) >= getTop(rect1)
    );
  }

  export function overlapsCircle(rect: Rect, circle: Circle): boolean {
    if (containsPoint(rect, circle.center)) {
      return true;
    }

    const closestPoint = getClosestPoint(rect, circle.center);

    return Circle.containsPoint(circle, closestPoint);
  }

  export function getIntersectionRect(rect1: Rect, rect2: Rect): Rect | null {
    const xMin = Math.max(getLeft(rect1), getLeft(rect2));
    const xMax = Math.min(getRight(rect1), getRight(rect2));
    const yMin = Math.max(getTop(rect1), getTop(rect2));
    const yMax = Math.min(getBottom(rect1), getBottom(rect2));
    const width = xMax - xMin;
    const height = yMax - yMin;

    if (width <= 0 || height <= 0) {
      return null;
    }

    return { position: { x: xMin, y: yMin }, size: { width, height } };
  }
}
