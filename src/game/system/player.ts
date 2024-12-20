import {
  FacingDirection,
  LocationState,
  MovementState,
} from "@/game/component/character";
import { CharacterAnimation } from "@/game/component/animated";
import { Player } from "@/game/archetype/player";
import { Vec2 } from "@/engine/math/vec2";
import { Keys } from "@/engine/input/keys";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

const VELOCITY = 300;

export class PlayerControlSystem implements System {
  public update({ entities, inputs }: Scene, dt: number): void {
    const player = entities.queryFirstEntity(Player);

    if (!player) {
      return;
    }

    const {
      transform: { position },
      character,
      animated,
      drawable,
    } = player;
    const dir = Vec2.zero();

    if (inputs.isKeyPressed(Keys.ARROW_LEFT)) {
      dir.x -= 1;
      character.facingDirection = FacingDirection.WEST;
    }

    if (inputs.isKeyPressed(Keys.ARROW_RIGHT)) {
      dir.x += 1;
      character.facingDirection = FacingDirection.EAST;
    }

    if (inputs.isKeyPressed(Keys.ARROW_UP)) {
      dir.y -= 1;
    }

    if (inputs.isKeyPressed(Keys.ARROW_DOWN)) {
      dir.y += 1;
    }

    dir.normalize().multiplyScalar(VELOCITY);

    if (character.facingDirection === FacingDirection.WEST) {
      drawable.flipX = true;
    } else if (character.facingDirection === FacingDirection.EAST) {
      drawable.flipX = false;
    }

    if (dir.isZero()) {
      character.movementState = MovementState.IDLE;
    } else {
      if (inputs.isKeyPressed(Keys.SHIFT)) {
        dir.multiplyScalar(2);
        character.movementState = MovementState.RUNNING;
      } else {
        character.movementState = MovementState.WALKING;
      }

      if (
        character.locationState === LocationState.GROUNDED &&
        inputs.isKeyPressed(Keys.SPACE)
      ) {
        character.movementState = MovementState.JUMPING;
      }
    }

    switch (character.movementState) {
      case MovementState.IDLE:
        animated.play(CharacterAnimation.IDLE);
        break;
      case MovementState.WALKING:
        animated.play(CharacterAnimation.WALKING);
        break;
      case MovementState.RUNNING:
        animated.play(CharacterAnimation.RUNNING);
        break;
      case MovementState.JUMPING:
        animated.play(CharacterAnimation.JUMPING);
        break;
    }

    position.x += dir.x * dt;
    position.y += dir.y * dt;
  }
}
