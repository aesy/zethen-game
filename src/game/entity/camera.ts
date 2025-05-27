import { Transform2D } from "@/game/component/transform2D";
import { Camera as CameraComponent, ScaleMode } from "@/game/component/camera";
import { Attached } from "@/game/component/attached";
import { Camera } from "@/game/archetype/camera";
import { Dim2 } from "@/engine/math/dim2";
import { EntityManager } from "@/engine/ecs/entitymanager";
import { EntityId } from "@/engine/ecs/entity";

export function createCamera(
  entities: EntityManager,
  target: EntityId,
): EntityId {
  const transform = entities.getFirstComponent(target, Transform2D);

  return entities.createArchetype(Camera, {
    transform: new Transform2D(transform?.position?.clone()),
    camera: new CameraComponent(
      ScaleMode.CHANGE_LENGTH_TO_FIT_CANVAS,
      new Dim2(1200, 800),
    ),
    attached: new Attached(target),
  });
}
