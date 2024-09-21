import { loadImage } from "@/engine/util/image";
import { Point } from "@/engine/math/point";
import playerImg from "@/engine/experimental/cat-tilesheet.png";
import { EntityManager } from "@/engine/entity/manager";
import { EntityId } from "@/engine/entity";
import { Transform } from "@/engine/component/transform";
import { createSpritesFromSheet } from "@/engine/component/spritesheet";
import { Drawable } from "@/engine/component/drawable";
import { Controlled } from "@/engine/component/controlled";
import { Collidable } from "@/engine/component/collidable";
import { Character, LocationState, MovementState } from "@/engine/component/character";
import { Animated, FrameAnimation } from "@/engine/component/animated";
import { Player } from "@/engine/archetype/player";

export async function createPlayer(entities: EntityManager): Promise<EntityId> {
  const image = await loadImage(playerImg);
  const sprites = await createSpritesFromSheet(image, [
    { position: { x: 9, y: 20 }, size: { height: 12, width: 12 } },
    { position: { x: 41, y: 20 }, size: { height: 12, width: 12 } },
    { position: { x: 73, y: 20 }, size: { height: 12, width: 12 } },
    { position: { x: 105, y: 20 }, size: { height: 12, width: 12 } },
    { position: { x: 9, y: 52 }, size: { height: 12, width: 12 } },
    { position: { x: 41, y: 52 }, size: { height: 12, width: 12 } },
    { position: { x: 73, y: 52 }, size: { height: 12, width: 12 } },
    { position: { x: 105, y: 52 }, size: { height: 12, width: 12 } },
    { position: { x: 9, y: 84 }, size: { height: 12, width: 12 } },
    { position: { x: 41, y: 84 }, size: { height: 12, width: 12 } },
    { position: { x: 73, y: 84 }, size: { height: 12, width: 12 } },
    { position: { x: 105, y: 84 }, size: { height: 12, width: 12 } },
    { position: { x: 9, y: 116 }, size: { height: 12, width: 12 } },
    { position: { x: 41, y: 116 }, size: { height: 12, width: 12 } },
    { position: { x: 73, y: 116 }, size: { height: 12, width: 12 } },
    { position: { x: 105, y: 116 }, size: { height: 12, width: 12 } },
  ]);

  const transform = new Transform({ x: 400, y: 400 });

  return entities.createArchetype(Player, {
    transform: transform,
    character: new Character(LocationState.GROUNDED, MovementState.IDLE),
    controlled: new Controlled(),
    collidable: Collidable.ofCircle({ center: Point.ORIGIN, radius: 40 }),
    drawable: new Drawable(
      sprites[0],
      { x: 0, y: 0 },
      { width: 64, height: 64 },
    ),
    animated: new Animated(new FrameAnimation(sprites, 0.15)),
  });
}
