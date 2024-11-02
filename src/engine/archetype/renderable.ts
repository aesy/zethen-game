import { ZIndex } from "@/engine/component/zindex";
import { Transform2D } from "@/engine/component/transform2D";
import { Drawable } from "@/engine/component/drawable";
import { Archetype } from "@/engine/archetype";

export const Renderable = Archetype.builder()
  .single("transform", Transform2D)
  .single("drawable", Drawable)
  .optional("zIndex", ZIndex)
  .build();
