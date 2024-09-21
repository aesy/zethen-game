import { Transform } from "@/engine/component/transform";
import { Rectangle } from "@/engine/component/rectangle";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Archetype } from "@/engine/archetype";

export const Box = Archetype.builder()
  .single("transform", Transform)
  .single("rectangle", Rectangle)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .build();
