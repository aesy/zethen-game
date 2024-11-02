import { Vec2 } from "@/engine/math/vec2";
import { Rgba } from "@/engine/math/rgba";
import { Pnt2 } from "@/engine/math/pnt2";
import { Circle } from "@/engine/math/circle";
import { EntityManager } from "@/engine/entity/manager";
import { EntityId } from "@/engine/entity";
import { ZIndex } from "@/engine/component/zindex";
import { Transform2D } from "@/engine/component/transform2D";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Circle as CircleComponent } from "@/engine/component/circle";
import { Ball } from "@/engine/archetype/ball";

export function createBall(entities: EntityManager): EntityId {
  const transform = new Transform2D(
    new Pnt2(Math.random() * 1600, Math.random() * 800),
  );
  const velocity = new Vec2(
    (Math.random() * 1000 - 500) * 0.2,
    (Math.random() * 1000 - 500) * 0.2,
  );
  const radius = Math.random() * 60 + 20;
  const circle = new CircleComponent(radius, new Rgba(125, 200, 0, 1));
  const physical = new Physical(10, velocity);
  const collidable = new Collidable(new Circle(0, 0, radius));
  const zIndex = new ZIndex(1);

  return entities.createArchetype(Ball, {
    transform,
    circle,
    physical,
    collidable,
    zIndex,
  });
}
