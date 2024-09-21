import { System } from "@/engine/system";
import { Scene } from "@/engine/game/scene";
import { Movable } from "@/engine/archetype/movable";

export class GravitySystem implements System {
  constructor(private force: number = 500) {}

  public update({ entities }: Scene, dt: number): void {
    const movables = entities
      .queryAllEntities(Movable)
      .filter((movable) => Boolean(movable.physical));

    for (const movable of movables) {
      const { physical } = movable;
      const { velocity } = physical!;

      velocity.y += this.force * dt;
    }
  }
}
