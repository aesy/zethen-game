import { System } from "@/engine/system";
import { Vector2 } from "@/engine/math/vector";
import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
} from "@/engine/input/keys";
import { Scene } from "@/engine/game/scene";
import { Player } from "@/engine/archetype/player";

const VELOCITY = 500;

export class ControlSystem implements System {
  public update({ entities, inputs }: Scene, dt: number): void {
    const controllables = entities.queryAllEntities(Player);

    for (const controllable of controllables) {
      const {
        transform: { position },
      } = controllable;

      const dir = Vector2.zero();

      if (inputs.isKeyPressed(ARROW_LEFT)) {
        dir.x -= 1;
      }

      if (inputs.isKeyPressed(ARROW_RIGHT)) {
        dir.x += 1;
      }

      if (inputs.isKeyPressed(ARROW_UP)) {
        dir.y -= 1;
      }

      if (inputs.isKeyPressed(ARROW_DOWN)) {
        dir.y += 1;
      }

      dir.normalize().multiplyScalar(VELOCITY);

      position.x += dir.x * dt;
      position.y += dir.y * dt;
    }
  }
}
