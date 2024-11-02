import { ZIndex } from "@/engine/component/zindex";
import { Transform2D } from "@/engine/component/transform2D";
import { Drawable } from "@/engine/component/drawable";
import { Collidable } from "@/engine/component/collidable";
import { Archetype } from "@/engine/archetype";

export const Tile = Archetype.builder()
  .single("transform", Transform2D)
  .optional("drawable", Drawable)
  .optional("collidable", Collidable)
  .optional("zIndex", ZIndex)
  .build();
