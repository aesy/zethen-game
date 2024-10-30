import { System } from "@/engine/system";
import { Scene } from "@/engine/game/scene";
import { Query } from "@/engine/entity/query";
import { Drawable } from "@/engine/component/drawable";
import { Animated } from "@/engine/component/animated";

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
