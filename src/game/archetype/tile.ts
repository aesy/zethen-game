import { ZIndex } from "@/game/component/zindex";
import { Transform2D } from "@/game/component/transform2D";
import { Drawable } from "@/game/component/drawable";
import { Collidable } from "@/game/component/collidable";
import { Archetype } from "@/engine/ecs/archetype";

export const Tile = Archetype.builder()
  .single("transform", Transform2D)
  .optional("drawable", Drawable)
  .optional("collidable", Collidable)
  .optional("zIndex", ZIndex)
  .build();
