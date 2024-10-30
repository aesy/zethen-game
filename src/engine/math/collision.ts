import { Vec2 } from "@/engine/math/vec2";
import { Rect } from "@/engine/math/rect";
import { Pnt2Like } from "@/engine/math/pnt2";
import { Circle } from "@/engine/math/circle";
import { Collider } from "@/engine/component/collidable";

export type Collision = {
  position: Pnt2Like;
  normal: Vec2;
  direction: Vec2;
};

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

function getCollisionDirection(circle1: Circle, circle2: Circle): Vec2 {
  return Vec2.from(circle2.center).subtract(circle1.center).normalize();
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
    if (collider1 instanceof Circle && collider2 instanceof Circle) {
      const direction = getCollisionDirection(collider1, collider2);

      return {
        position: Vec2.from(collider2.center).subtract(
          Vec2.from(collider1.center).multiplyScalar(0.5),
        ),
        direction,
        normal: null!,
      };
    } else if (collider1 instanceof Rect && collider2 instanceof Rect) {
      // throw new Error("Not implemented");
    } else if (collider1 instanceof Circle && collider2 instanceof Rect) {
      // throw new Error("Not implemented");
    } else if (collider1 instanceof Rect && collider2 instanceof Circle) {
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
