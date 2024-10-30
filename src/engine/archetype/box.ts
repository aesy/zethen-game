import { Transform2D } from "@/engine/component/transform2D";
import { Rectangle } from "@/engine/component/rectangle";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Archetype } from "@/engine/archetype";

export const Box = Archetype.builder()
  .single("transform", Transform2D)
  .single("rectangle", Rectangle)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .build();
