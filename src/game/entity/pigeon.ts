import { ZIndex } from "@/game/component/zindex";
import { Transform2D } from "@/game/component/transform2D";
import { Health } from "@/game/component/health";
import { Drawable } from "@/game/component/drawable";
import { Controlled } from "@/game/component/controlled";
import { Collidable } from "@/game/component/collidable";
import {
  Character,
  FacingDirection,
  LocationState,
  MovementState,
} from "@/game/component/character";
import {
  Animated,
  CharacterAnimation,
  FrameAnimation,
} from "@/game/component/animated";
import { Animal, Diet } from "@/game/component/animal";
import { Pigeon } from "@/game/archetype/pigeon";
import { loadImage } from "@/engine/util/image";
import { Rect } from "@/engine/math/rect";
import { Pnt2 } from "@/engine/math/pnt2";
import { Dim2 } from "@/engine/math/dim2";
import { Circle } from "@/engine/math/circle";
import { SpriteSheet } from "@/engine/image/spritesheet";
import { EntityManager } from "@/engine/ecs/entitymanager";
import { EntityId } from "@/engine/ecs/entity";
import pigeonImg from "@/assets/sprites/pigeon.png";

export async function createPigeon(entities: EntityManager): Promise<EntityId> {
  const image = await loadImage(pigeonImg);
  const idleSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(9, 8, 16, 16),
    new Rect(41, 8, 16, 16),
    new Rect(73, 8, 16, 16),
    new Rect(105, 8, 16, 16),
  ]);
  const walkSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(9, 40, 16, 16),
    new Rect(41, 40, 16, 16),
    new Rect(73, 40, 16, 16),
    new Rect(105, 40, 16, 16),
  ]);
  const eatSpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(9, 72, 16, 16),
    new Rect(41, 72, 16, 16),
    new Rect(73, 72, 16, 16),
    new Rect(105, 72, 16, 16),
  ]);
  const flySpritesheet = await SpriteSheet.fromPredefined(image, [
    new Rect(9, 104, 16, 16),
    new Rect(41, 104, 16, 16),
    new Rect(73, 104, 16, 16),
    new Rect(105, 104, 16, 16),
  ]);

  return entities.createArchetype(Pigeon, {
    transform: new Transform2D(
      new Pnt2(Math.random() * 4000, Math.random() * 2000),
    ),
    character: new Character(
      LocationState.GROUNDED,
      MovementState.IDLE,
      FacingDirection.EAST,
    ),
    animal: new Animal(Diet.HERBIVORE),
    collidable: new Collidable(new Circle(0, 0, 25)),
    drawable: new Drawable(
      idleSpritesheet[0],
      new Pnt2(-32, -32),
      new Dim2(64, 64),
    ),
    animated: new Animated(
      {
        [CharacterAnimation.IDLE]: new FrameAnimation(idleSpritesheet, 0.15),
        [CharacterAnimation.WALKING]: new FrameAnimation(walkSpritesheet, 0.1),
        [CharacterAnimation.EATING]: new FrameAnimation(eatSpritesheet, 0.1),
        [CharacterAnimation.FLYING]: new FrameAnimation(flySpritesheet, 0.1),
      },
      CharacterAnimation.FLYING,
    ),
    zIndex: new ZIndex(3),
    health: new Health(1),
  });
}
