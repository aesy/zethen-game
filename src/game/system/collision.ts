import { Movable } from "@/game/archetype/movable";
import { Rect } from "@/engine/math/rect";
import { Circle } from "@/engine/math/circle";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class CollisionSystem implements System {
  public update({ entities }: Scene, _dt: number): void {
    const movables = entities
      .queryAllEntities(Movable)
      .filter((movable) => Boolean(movable.collidable));

    for (let i = 0; i < movables.length; i++) {
      const movable1 = movables[i];
      const { transform: transform1, collidable: collidable1 } = movable1;
      const { collider: collider1 } = collidable1!;

      for (let j = i + 1; j < movables.length; j++) {
        const movable2 = movables[j];
        const { transform: transform2, collidable: collidable2 } = movable2;
        const { collider: collider2 } = collidable2!;

        if (collider1 instanceof Circle && collider2 instanceof Circle) {
          const circle1 = Circle.from({
            center: collider1.center.clone().add(transform1.position),
            radius: collider1.radius * transform1.scale.width,
          });
          const circle2 = Circle.from({
            center: collider2.center.clone().add(transform2.position),
            radius: collider2.radius * transform2.scale.width,
          });
        } else if (collider1 instanceof Rect && collider2 instanceof Rect) {
          const rect1 = Rect.from({
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            width: collider1.width * transform1.scale.width,
            height: collider1.height * transform1.scale.height,
          });
          const rect2 = Rect.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            width: collider2.width * transform2.scale.width,
            height: collider2.height * transform2.scale.height,
          });
        } else if (collider1 instanceof Circle && collider2 instanceof Rect) {
          const circle = Circle.from({
            center: collider1.center.clone().add(transform1.position),
            radius: collider1.radius * transform1.scale.width,
          });
          const rect = Rect.from({
            x: collider2.x + transform2.position.x,
            y: collider2.y + transform2.position.y,
            width: collider2.width * transform2.scale.width,
            height: collider2.height * transform2.scale.height,
          });
        } else if (collider1 instanceof Rect && collider2 instanceof Circle) {
          const rect = Rect.from({
            x: collider1.x + transform1.position.x,
            y: collider1.y + transform1.position.y,
            width: collider1.width * transform1.scale.width,
            height: collider1.height * transform1.scale.height,
          });
          const circle = Circle.from({
            center: collider2.center.clone().add(transform2.position),
            radius: collider2.radius * transform2.scale.width,
          });
        }
      }
    }
  }

  private handleCircleCircleCollision(): void {}

  private handleRectRectCollision(): void {}

  private handleCircleRectCollision(): void {}
}
