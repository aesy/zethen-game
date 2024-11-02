import { Vec2 } from "@/engine/math/vec2";
import { Rgba } from "@/engine/math/rgba";
import { Rect } from "@/engine/math/rect";
import { Pnt2 } from "@/engine/math/pnt2";
import { Dim2 } from "@/engine/math/dim2";
import { EntityManager } from "@/engine/entity/manager";
import { EntityId } from "@/engine/entity";
import { ZIndex } from "@/engine/component/zindex";
import { Transform2D } from "@/engine/component/transform2D";
import { Rectangle } from "@/engine/component/rectangle";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Box } from "@/engine/archetype/box";

export function createBox(entities: EntityManager): EntityId {
  const transform = new Transform2D(
    new Pnt2(Math.random() * 1600, Math.random() * 800),
  );
  const velocity = new Vec2(
    (Math.random() * 1000 - 500) * 0.2,
    (Math.random() * 1000 - 500) * 0.2,
  );
  const size = new Dim2(Math.random() * 80 + 20, Math.random() * 80 + 20);
  const rectangle = new Rectangle(size, new Rgba(0, 0, 255, 1));
  const physical = new Physical(10, velocity);
  const collidable = new Collidable(new Rect(0, 0, size.width, size.height));
  const zIndex = new ZIndex(1);

  return entities.createArchetype(Box, {
    transform,
    rectangle,
    physical,
    collidable,
    zIndex,
  });
}
