import { Drawable } from "@/game/component/drawable";
import { Animated } from "@/game/component/animated";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";

export class AnimationSystem implements System {
  public update({ entities }: Scene, dt: number): void {
    const query = Query.create()
      .single("animated", Animated)
      .optional("drawable", Drawable);
    const result = entities.queryAllEntities(query);

    for (const { animated, drawable } of result) {
      animated.tick(dt);

      if (drawable) {
        drawable.content = animated.getImage();
      }
    }
  }
}
