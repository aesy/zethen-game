import { System } from "@/engine/system";
import { Vector2 } from "@/engine/math/vector";
import { Point } from "@/engine/math/point";
import { Scene } from "@/engine/game/scene";
import { EntityOf } from "@/engine/entity";
import { Movable } from "@/engine/archetype/movable";
import { Ball } from "@/engine/archetype/ball";

export class CollisionSystem implements System {
  public update({ entities }: Scene, _dt: number): void {
    const balls = entities.queryAllEntities(Ball);

    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const movable1 = balls[i];
        const movable2 = balls[j];

        if (!isOverlapping(movable1, movable2)) {
          break;
        }

        const collisionDirection = getCollisionDirection(movable1, movable2);
        const speed = getCollisionVelocity(movable1, movable2);

        if (speed < 0) {
          break;
        }

        collisionDirection.magnitude = speed;
        movable1.physical!.velocity.subtract(collisionDirection);
        movable2.physical!.velocity.add(collisionDirection);
      }
    }
  }
}

function isOverlapping(
  ball1: EntityOf<typeof Ball>,
  ball2: EntityOf<typeof Ball>,
): boolean {
  const distanceSquared = Point.distanceSquared(
    ball1.transform.position,
    ball2.transform.position,
  );
  const radiusSumSquared = Math.pow(
    ball1.circle.radius + ball2.circle.radius,
    2,
  );

  return distanceSquared <= radiusSumSquared;
}

function getCollisionDirection(
  movable1: EntityOf<typeof Movable>,
  movable2: EntityOf<typeof Movable>,
): Vector2 {
  return Vector2.fromPoint(movable2.transform.position)
    .subtract(movable1.transform.position)
    .normalize();
}

function getCollisionVelocity(
  movable1: EntityOf<typeof Movable>,
  movable2: EntityOf<typeof Movable>,
): number {
  const collisionDirection = getCollisionDirection(movable1, movable2);

  return Vector2.fromPoint(movable1.physical!.velocity)
    .subtract(movable2.physical!.velocity)
    .dot(collisionDirection);
}
