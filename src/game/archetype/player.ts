import { ZIndex } from "@/game/component/zindex";
import { Transform2D } from "@/game/component/transform2D";
import { Health } from "@/game/component/health";
import { Drawable } from "@/game/component/drawable";
import { Controlled } from "@/game/component/controlled";
import { Collidable } from "@/game/component/collidable";
import { Character } from "@/game/component/character";
import { Animated } from "@/game/component/animated";
import { Archetype } from "@/engine/ecs/archetype";

export const Player = Archetype.builder()
  .single("transform", Transform2D)
  .single("character", Character)
  .single("controlled", Controlled)
  .single("collidable", Collidable)
  .single("drawable", Drawable)
  .single("animated", Animated)
  .single("health", Health)
  .optional("zIndex", ZIndex)
  .build();
