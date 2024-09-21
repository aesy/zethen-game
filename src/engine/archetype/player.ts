import { Transform } from "@/engine/component/transform";
import { Drawable } from "@/engine/component/drawable";
import { Controlled } from "@/engine/component/controlled";
import { Collidable } from "@/engine/component/collidable";
import { Character } from "@/engine/component/character";
import { Animated } from "@/engine/component/animated";
import { Archetype } from "@/engine/archetype";

export const Player = Archetype.builder()
  .single("transform", Transform)
  .single("character", Character)
  .single("controlled", Controlled)
  .single("collidable", Collidable)
  .single("drawable", Drawable)
  .single("animated", Animated)
  .build();
