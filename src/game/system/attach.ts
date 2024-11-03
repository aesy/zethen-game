import { Transform2D } from "@/game/component/transform2D";
import { Attached } from "@/game/component/attached";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

export class AttachSystem implements System {
  public update({ entities }: Scene, _dt: number): void {
    const attachedEntities = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("attached", Attached),
    );

    for (const { transform, attached } of attachedEntities) {
      const targetEntity = entities.getFirstComponent(
        attached.target,
        Transform2D,
      );

      if (targetEntity) {
        transform.position.copy(targetEntity.position);
      }
    }
  }
}
