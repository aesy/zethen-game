import { Transform2D } from "@/engine/component/transform2D";
import { Physical } from "@/engine/component/physical";
import { Collidable } from "@/engine/component/collidable";
import { Circle } from "@/engine/component/circle";
import { Archetype } from "@/engine/archetype";

export const Ball = Archetype.builder()
  .single("transform", Transform2D)
  .single("circle", Circle)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .build();
