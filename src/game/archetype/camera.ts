import { Transform2D } from "@/game/component/transform2D";
import { Camera as CameraComponent } from "@/game/component/camera";
import { Attached } from "@/game/component/attached";
import { Archetype } from "@/engine/ecs/archetype";

export const Camera = Archetype.builder()
  .single("transform", Transform2D)
  .single("camera", CameraComponent)
  .optional("attached", Attached)
  .build();
