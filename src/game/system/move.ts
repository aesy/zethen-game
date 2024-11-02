import { Movable } from "@/game/archetype/movable";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class MoveSystem implements System {
  public update({ entities }: Scene, dt: number): void {
    const movables = entities
      .queryAllEntities(Movable)
      .filter((movable) => Boolean(movable.physical));

    for (const movable of movables) {
      const {
        transform: { position },
        physical,
      } = movable;
      const { velocity } = physical!;

      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    }
  }
}
