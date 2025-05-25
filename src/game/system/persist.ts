import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { EntityId } from "@/engine/ecs/entity";
import { Component } from "@/engine/ecs/component";

type Persisted = {
  entityId: EntityId;
  components: Component[];
};

export class PersistSystem implements System {
  // TODO use a map for quick lookups
  private persisted: Persisted[] = [];

  public update(_scene: Scene, _dt: number): void {
    // const entitiesWithTransforms: SpawnEntity[] = [];
    // const simulationArea: RectLike = { x: 0, y: 0, width: 0, height: 0 };
    //
    // for (const entity of entitiesWithTransforms) {
    //   if (!Rect.containsPoint(simulationArea, entity.position)) {
    //     if (entity.persistable) {
    //       this.persisted.push({ entityId: entity, components: [] });
    //     }
    //
    //     // TODO remove entity
    //   }
    // }
    //
    // for (let i = 0; i < this.persisted.length; i++) {
    //   const persisted = this.persisted[i];
    //
    //   if (!Rect.containsPoint(simulationArea, persisted.entityId.position)) {
    //     this.persisted.splice(i, 1);
    //
    //     // TODO add entity
    //   }
    // }
  }
}
