import { System } from "@/engine/system";
import { Scene } from "@/engine/game/scene";
import { Movable } from "@/engine/archetype/movable";

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
