import { Transform2D } from "@/game/component/transform2D";
import { Physical } from "@/game/component/physical";
import { Collidable } from "@/game/component/collidable";
import { Archetype } from "@/engine/ecs/archetype";

export const Movable = Archetype.builder()
  .single("transform", Transform2D)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .build();
