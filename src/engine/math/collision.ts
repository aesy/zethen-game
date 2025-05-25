import { Vec2 } from "@/engine/math/vec2";
import { Rect } from "@/engine/math/rect";
import { Pnt2 } from "@/engine/math/pnt2";
import { Circle } from "@/engine/math/circle";

export type Shape = Rect | Circle;

export type PhysicsBody2 = {
  position: Pnt2;
  velocity: Vec2;
  shape: Shape;
  restitution?: number;
  mass?: number;
  static?: boolean;
  lock?: {
    positionX?: boolean;
    positionY?: boolean;
    rotationX?: boolean;
    rotationY?: boolean;
  };
};

export type Collision = {
  penetration: Vec2; // "Normal"
  collisionPoint: Vec2[];
  bodies: [PhysicsBody2, PhysicsBody2];
};

/**
 * TODO
 * - Check penetration and intersection points
 * - Separate by reversing position based on relative velocity
 * - Bounce based on penetration vector mass and restitution
 */

// function getOverlap(circle1: Circle, circle2: Circle): Rect | null {
//   if (!isOverlapping(circle1, circle2)) {
//     return null;
//   }
//
//   const position = Vector2.fromPoint(circle1)
//     .subtractScalar(circle1.radius)
//     .subtract(Vector2.fromPoint(circle2).subtractScalar(circle2.radius))
//     .abs();
//   const overlap =
//     circle1.radius +
//     circle2.radius -
//     Points.distance(circle1, circle2);
//
//   return { position, size };
// }
//
// function getCollisionDirection(circle1: Circle, circle2: Circle): Vec2 {
//   return Vec2.from(circle2).subtract(circle1).normalize();
// }
//
// function getCollisionVelocity(circle1: Circle, circle2: Circle): number {
//   const collisionDirection = getCollisionDirection(circle1, circle2);
//
//   return Vector2.fromPoint(circle1.velocity)
//     .subtract(circle2.velocity)
//     .dot(collisionDirection);
// }
//
// export function resolveCollision(collision: Collision): void {
//   const [a, b] = collision.bodies;
//   const elasticity = Math.min(a.restitution, b.restitution);
//
//   const relVelocity = a.velocity - b.velocity;
//   const impulseMagnitude =
//     (-(1 + elasticity) * dot(relVelocity, collision.penetration)) /
//     (a.invMass + b.invMass);
//   const impulseDirection = collision.penetration;
//   const impulse = impulseDirection * impulseMagnitude; // mul, not dot
//
//   a.applyImpulse(impulse);
//   b.applyImpulse(-impulse);
// }

export namespace Collision {
  export function get(collider1: Shape, collider2: Shape): Collision | null {
    if (collider1 instanceof Circle && collider2 instanceof Circle) {
      // TODO
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
