import { Transform2D } from "@/game/component/transform2D";
import { Physical } from "@/game/component/physical";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

export class MoveSystem implements System {
  public update({ entities }: Scene, dt: number): void {
    const movables = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("physical", Physical),
    );

    for (const movable of movables) {
      const {
        transform: { position },
        physical,
      } = movable;
      const { velocity } = physical!;

      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    }
  }
}
