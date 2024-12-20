import { Transform2D } from "@/game/component/transform2D";
import { Camera as CameraComponent } from "@/game/component/camera";
import { Attached } from "@/game/component/attached";
import { Camera } from "@/game/archetype/camera";
import { EntityManager } from "@/engine/ecs/entitymanager";
import { EntityId } from "@/engine/ecs/entity";

export function createCamera(
  entities: EntityManager,
  target: EntityId,
): EntityId {
  const transform = entities.getFirstComponent(target, Transform2D);

  return entities.createArchetype(Camera, {
    transform: new Transform2D(transform?.position?.clone()),
    camera: new CameraComponent(),
    attached: new Attached(target),
  });
}
