import { Vector2 } from "@/engine/math/vector";
import { Point } from "@/engine/math/point";
import { Color } from "@/engine/math/color";
import { EntityManager } from "@/engine/entity/manager";
import { EntityId } from "@/engine/entity";
import { Transform } from "@/engine/component/transform";
import { Rectangle } from "@/engine/component/rectangle";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Box } from "@/engine/archetype/box";

export function createBox(entities: EntityManager): EntityId {
  const position = { x: Math.random() * 800, y: Math.random() * 800 };
  const transform = new Transform(position);
  const velocity = new Vector2(
    (Math.random() * 1000 - 500) * 0.2,
    (Math.random() * 1000 - 500) * 0.2,
  );
  const size = {
    width: Math.random() * 80 + 40,
    height: Math.random() * 80 + 40,
  };
  const rectangle = new Rectangle(size, Color.fromRGB(0, 0, 255, 1));
  const physical = new Physical(10, velocity);
  const collidable = Collidable.ofRect({ position: Point.ORIGIN, size });

  return entities.createArchetype(Box, {
    transform,
    rectangle,
    physical,
    collidable,
  });
}
