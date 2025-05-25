import { Collisions } from "@/game/resource/collisions";
import { Lifetime } from "@/game/component/lifetime";
import { Health } from "@/game/component/health";
import { loadAudio } from "@/engine/util/audio";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import meowSound from "@/assets/sounds/meow.wav";

const meow = await loadAudio(meowSound);

export class DamageSystem implements System {
  public update({ entities, audio, resources }: Scene, _dt: number): void {
    const collisions = resources.get(Collisions)!;

    for (const collision of collisions) {
      for (const entity of [collision.source, collision.target]) {
        const health = entities.getFirstComponent(entity, Health);

        if (health) {
          const hpBefore = health.hpLeft;
          health.hpLeft = Math.max(hpBefore - 1, 0);

          if (health.hpLeft !== hpBefore) {
            audio.play(meow);
          }
        }

        const lifetime = entities.getFirstComponent(entity, Lifetime);

        if ((!health || (health && health.hpLeft === 0)) && !lifetime) {
          entities.addComponent(entity, new Lifetime(0));
        }
      }
    }
  }
}
