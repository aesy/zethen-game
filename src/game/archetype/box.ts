import { ZIndex } from "@/game/component/zindex";
import { Transform2D } from "@/game/component/transform2D";
import { Rectangle } from "@/game/component/rectangle";
import { Physical } from "@/game/component/physical";
import { Collidable } from "@/game/component/collidable";
import { Archetype } from "@/engine/ecs/archetype";

export const Box = Archetype.builder()
  .single("transform", Transform2D)
  .single("rectangle", Rectangle)
  .optional("physical", Physical)
  .optional("collidable", Collidable)
  .optional("zIndex", ZIndex)
  .build();
