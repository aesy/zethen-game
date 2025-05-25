import { Collisions } from "@/game/resource/collisions";
import { Lifetime } from "@/game/component/lifetime";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class DamageSystem implements System {
  public update({ entities, resources }: Scene, _dt: number): void {
    const collisions = resources.get(Collisions)!;

    for (const collision of collisions) {
      for (const entity of [collision.source, collision.target]) {
        const liftetime = entities.getFirstComponent(entity, Lifetime);

        if (!liftetime) {
          entities.addComponent(entity, new Lifetime(0));
        }
      }
    }
  }
}
