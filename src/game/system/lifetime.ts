import { Lifetime } from "@/game/component/lifetime";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

export class LifetimeSystem implements System {
  public update({ entities }: Scene, dt: number): void {
    const lifetimes = entities.queryAllEntities(
      Query.create().single("lifetime", Lifetime),
    );

    for (const entity of lifetimes) {
      entity.lifetime.tick(dt);

      if (entity.lifetime.isOver) {
        // TODO emit event
        entities.deleteEntity(entity.id);
      }
    }
  }
}
