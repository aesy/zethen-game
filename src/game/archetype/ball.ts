import { ZIndex } from "@/game/component/zindex";
import { Transform2D } from "@/game/component/transform2D";
import { Physical } from "@/game/component/physical";
import { Collidable } from "@/game/component/collidable";
import { Circle } from "@/game/component/circle";
import { Archetype } from "@/engine/ecs/archetype";

export const Ball = Archetype.builder()
  .single("transform", Transform2D)
  .single("circle", Circle)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .optional("zIndex", ZIndex)
  .build();
