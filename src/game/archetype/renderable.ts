import { ZIndex } from "@/game/component/zindex";
import { Transform2D } from "@/game/component/transform2D";
import { Drawable } from "@/game/component/drawable";
import { Archetype } from "@/engine/ecs/archetype";

export const Renderable = Archetype.builder()
  .single("transform", Transform2D)
  .single("drawable", Drawable)
  .optional("zIndex", ZIndex)
  .build();
