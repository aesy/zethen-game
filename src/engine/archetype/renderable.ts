import { Transform } from "@/engine/component/transform";
import { Drawable } from "@/engine/component/drawable";
import { Archetype } from "@/engine/archetype";

export const Renderable = Archetype.builder()
  .single("transform", Transform)
  .single("drawable", Drawable)
  .build();
