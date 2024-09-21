import { Vector2 } from "@/engine/math/vector";
import { Point } from "@/engine/math/point";
import { Color } from "@/engine/math/color";
import { EntityManager } from "@/engine/entity/manager";
import { EntityId } from "@/engine/entity";
import { Transform } from "@/engine/component/transform";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Circle } from "@/engine/component/circle";
import { Ball } from "@/engine/archetype/ball";

export function createBall(entities: EntityManager): EntityId {
  const position = { x: Math.random() * 800, y: Math.random() * 800 };
  const transform = new Transform(position);
  const velocity = new Vector2(
    (Math.random() * 1000 - 500) * 0.2,
    (Math.random() * 1000 - 500) * 0.2,
  );
  const radius = Math.random() * 20 + 10;
  const circle = new Circle(radius, Color.fromRGB(255, 0, 0, 1));
  const physical = new Physical(10, velocity);
  const collidable = Collidable.ofCircle({ center: Point.ORIGIN, radius });

  return entities.createArchetype(Ball, {
    transform,
    circle,
    physical,
    collidable,
  });
}
