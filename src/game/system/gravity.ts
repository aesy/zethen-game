import { Transform2D } from "@/game/component/transform2D";
import { Physical } from "@/game/component/physical";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

export class GravitySystem implements System {
  constructor(private force: number = 500) {}

  public update({ entities }: Scene, dt: number): void {
    const movables = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("physical", Physical),
    );

    for (const movable of movables) {
      const { physical } = movable;
      const { velocity } = physical!;

      velocity.y += this.force * dt;
    }
  }
}
