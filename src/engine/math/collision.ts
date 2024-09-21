import { Vector2 } from "@/engine/math/vector";
import { Rect } from "@/engine/math/rect";
import { Point2 } from "@/engine/math/point";
import { Circle } from "@/engine/math/circle";
import { Collider } from "@/engine/component/collidable";

export interface Collision {
  position: Point2;
  normal: Vector2;
  direction: Vector2;
}

// function getOverlap(circle1: Circle, circle2: Circle): Rect | null {
//   if (!isOverlapping(circle1, circle2)) {
//     return null;
//   }
//
//   const position = Vector2.fromPoint(circle1.center)
//     .subtractScalar(circle1.radius)
//     .subtract(Vector2.fromPoint(circle2.center).subtractScalar(circle2.radius))
//     .abs();
//   const overlap =
//     circle1.radius +
//     circle2.radius -
//     Points.distance(circle1.center, circle2.center);
//
//   return { position, size };
// }

function getCollisionDirection(circle1: Circle, circle2: Circle): Vector2 {
  return Vector2.fromPoint(circle2.center).subtract(circle1.center).normalize();
}

// function getCollisionVelocity(circle1: Circle, circle2: Circle): number {
//   const collisionDirection = getCollisionDirection(circle1, circle2);
//
//   return Vector2.fromPoint(circle1.velocity)
//     .subtract(circle2.velocity)
//     .dot(collisionDirection);
// }

export namespace Collision {
  export function get(
    collider1: Collider,
    collider2: Collider,
  ): Collision | null {
    if (Circle.isInstance(collider1) && Circle.isInstance(collider2)) {
      const direction = getCollisionDirection(collider1, collider2);

      return {
        position: Vector2.fromPoint(collider2.center).subtract(
          Vector2.fromPoint(collider1.center).multiplyScalar(0.5),
        ),
        direction,
        normal: null!,
      };
    } else if (Rect.isInstance(collider1) && Rect.isInstance(collider2)) {
      // throw new Error("Not implemented");
    } else if (Circle.isInstance(collider1) && Rect.isInstance(collider2)) {
      // throw new Error("Not implemented");
    } else if (Rect.isInstance(collider1) && Circle.isInstance(collider2)) {
      // throw new Error("Not implemented");
    } else {
      throw new Error("Not implemented");
    }

    return null;
  }

  export function resolve(collision: Collision): void {
    // TODO
  }
}
