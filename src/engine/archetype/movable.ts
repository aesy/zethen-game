import { Transform } from "@/engine/component/transform";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Archetype } from "@/engine/archetype";

export const Movable = Archetype.builder()
  .single("transform", Transform)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .build();
