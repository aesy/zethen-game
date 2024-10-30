import { Transform2D } from "@/engine/component/transform2D";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Archetype } from "@/engine/archetype";

export const Movable = Archetype.builder()
  .single("transform", Transform2D)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .build();
