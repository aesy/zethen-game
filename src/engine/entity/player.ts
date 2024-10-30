import { loadImage } from "@/engine/util/image";
import { Rect } from "@/engine/math/rect";
import { Pnt2 } from "@/engine/math/pnt2";
import { Dim2 } from "@/engine/math/dim2";
import { Circle } from "@/engine/math/circle";
import { SpriteSheet } from "@/engine/image/spritesheet";
import playerImg from "@/engine/experimental/cat-tilesheet.png";
import { EntityManager } from "@/engine/entity/manager";
import { EntityId } from "@/engine/entity";
import { Transform2D } from "@/engine/component/transform2D";
import { Drawable } from "@/engine/component/drawable";
import { Controlled } from "@/engine/component/controlled";
import { Collidable } from "@/engine/component/collidable";
import {
  Character,
  FacingDirection,
  LocationState,
  MovementState,
} from "@/engine/component/character";
import {
  Animated,
  CharacterAnimation,
  FrameAnimation,
} from "@/engine/component/animated";
import { Player } from "@/engine/archetype/player";

export async function createPlayer(entities: EntityManager): Promise<EntityId> {
  const image = await loadImage(playerImg);
  const idleSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(7, 18, 16, 16),
    new Rect(39, 18, 16, 16),
    new Rect(71, 18, 16, 16),
    new Rect(103, 18, 16, 16),
    new Rect(7, 50, 16, 16),
    new Rect(39, 50, 16, 16),
    new Rect(71, 50, 16, 16),
    new Rect(103, 50, 16, 16),
    new Rect(7, 82, 16, 16),
    new Rect(39, 82, 16, 16),
    new Rect(71, 82, 16, 16),
    new Rect(103, 82, 16, 16),
    new Rect(7, 114, 16, 16),
    new Rect(39, 114, 16, 16),
    new Rect(71, 114, 16, 16),
    new Rect(103, 114, 16, 16),
  ]);
  const walkSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(7, 146, 16, 16),
    new Rect(39, 146, 16, 16),
    new Rect(71, 146, 16, 16),
    new Rect(103, 146, 16, 16),
    new Rect(135, 146, 16, 16),
    new Rect(167, 146, 16, 16),
    new Rect(199, 146, 16, 16),
    new Rect(231, 146, 16, 16),
  ]);
  const runSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(7, 178, 16, 16),
    new Rect(39, 178, 16, 16),
    new Rect(71, 178, 16, 16),
    new Rect(103, 178, 16, 16),
    new Rect(135, 178, 16, 16),
    new Rect(167, 178, 16, 16),
    new Rect(199, 178, 16, 16),
    new Rect(231, 178, 16, 16),
  ]);
  const jumpSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(7, 274, 16, 16),
    new Rect(39, 274, 16, 16),
    new Rect(71, 274, 16, 16),
    new Rect(103, 274, 16, 16),
    new Rect(135, 274, 16, 16),
    new Rect(167, 274, 16, 16),
  ]);

  return entities.createArchetype(Player, {
    transform: new Transform2D(new Pnt2(400, 400)),
    character: new Character(
      LocationState.GROUNDED,
      MovementState.IDLE,
      FacingDirection.EAST,
    ),
    controlled: new Controlled(),
    collidable: new Collidable(
      new Circle(0, 0, 40),
      // new Rect(-30, -30, 60, 60),
    ),
    drawable: new Drawable(idleSpritesheet[0], Pnt2.zero(), new Dim2(64, 64)),
    animated: new Animated(
      {
        [CharacterAnimation.IDLE]: new FrameAnimation(idleSpritesheet, 0.15),
        [CharacterAnimation.WALKING]: new FrameAnimation(walkSpritesheet, 0.15),
        [CharacterAnimation.RUNNING]: new FrameAnimation(runSpritesheet, 0.15),
        [CharacterAnimation.JUMPING]: new FrameAnimation(jumpSpritesheet, 0.15),
      },
      CharacterAnimation.WALKING,
    ),
  });
}
