import { Transform2D } from "@/game/component/transform2D";
import { FacingDirection } from "@/game/component/character";
import { CharacterAnimation } from "@/game/component/animated";
import {
  Animal,
  Diet,
  Flee,
  Fleeing,
  Idle,
  Walking,
} from "@/game/component/animal";
import { Pigeon } from "@/game/archetype/pigeon";
import { Camera } from "@/game/archetype/camera";
import { Vec2 } from "@/engine/math/vec2";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

export class AiSystem implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, dt: number): void {
    const ctx = this.context;
    const camera = entities.queryFirstEntity(Camera);
    const pigeons = entities.queryAllEntities(Pigeon);
    const animals = entities.queryAllEntities(
      Query.create().single("animal", Animal).single("transform", Transform2D),
    );

    for (const pigeon of pigeons) {
      for (const animal of animals) {
        if (pigeon.id === animal.id) {
          continue;
        }

        const state = pigeon.animal.fsm.getState();

        if (state instanceof Fleeing) {
          if (
            camera &&
            !camera.camera.isRectInView(
              camera.transform,
              { ...pigeon.transform.position, ...pigeon.drawable.size },
              ctx.canvas,
            )
          ) {
            entities.deleteEntity(pigeon.id);
            continue;
          }
        }

        const direction = pigeon.transform.position
          .clone()
          .subtract(animal.transform.position);

        if (animal.animal.diet === Diet.CARNIVORE) {
          if (Vec2.getMagnitude(direction) < 300) {
            pigeon.animal.fsm.trigger(new Flee(direction));
          } else {
            pigeon.animal.fsm.trigger(new Idle(dt));
          }

          const dir = Vec2.zero();

          if (state instanceof Fleeing) {
            dir.add(state.direction);
          } else if (state instanceof Walking) {
            dir.add(state.direction);
          }

          if (dir.x < 0) {
            pigeon.drawable.flipX = true;
            pigeon.character.facingDirection = FacingDirection.WEST;
          } else {
            pigeon.drawable.flipX = false;
            pigeon.character.facingDirection = FacingDirection.EAST;
          }

          pigeon.transform.translate({ x: dir.x * dt, y: dir.y * dt });
        }

        if (state instanceof Fleeing) {
          pigeon.animated.play(CharacterAnimation.FLYING);
        } else if (state instanceof Walking) {
          pigeon.animated.play(CharacterAnimation.WALKING);
        } else {
          pigeon.animated.play(CharacterAnimation.IDLE);
        }
      }
    }
  }
}
