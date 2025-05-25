import { Collisions } from "@/game/resource/collisions";
import { Transform2D } from "@/game/component/transform2D";
import { Collidable } from "@/game/component/collidable";
import { QuadTree } from "@/engine/util/quadtree";
import { Rect, RectLike } from "@/engine/math/rect";
import { Circle } from "@/engine/math/circle";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import { Query } from "@/engine/ecs/query";
import { EntityId } from "@/engine/ecs/entity";

export class CollisionSystem implements System {
  public update({ entities, resources }: Scene, _dt: number): void {
    const movables = entities.queryAllEntities(
      Query.create()
        .single("transform", Transform2D)
        .single("collidable", Collidable),
    );
    const collisions = resources.getOrSet(Collisions, () => new Collisions());
    collisions.clear();

    // TODO
    const simulationBounds = {
      x: -10000,
      y: -10000,
      width: 20000,
      height: 20000,
    };
    const qTree = QuadTree.forRects<
      {
        id: EntityId;
        transform: Transform2D;
        collidable: Collidable;
      } & RectLike
    >(simulationBounds);

    // Broad phase
    for (const movable of movables) {
      const {
        transform,
        collidable: { collider },
      } = movable;

      const bounds = collider.getBoundingRect();
      // TODO transform
      qTree.insert({
        ...movable,
        x: bounds.x + transform.position.x,
        y: bounds.y + transform.position.y,
        width: bounds.width,
        height: bounds.height,
      });
    }

    // Narrow phase
    for (const node of qTree.getLeafNodes()) {
      const elements = node.getElements();

      for (let i = 0; i < elements.length; i++) {
        const element1 = elements[i];
        const {
          transform: transform1,
          collidable: { collider: collider1 },
        } = element1;

        for (let j = i + 1; j < elements.length; j++) {
          const element2 = elements[j];
          const {
            transform: transform2,
            collidable: { collider: collider2 },
          } = element2;

          if (collider1 instanceof Circle && collider2 instanceof Circle) {
            const circle1 = Circle.from({
              x: collider1.x + transform1.position.x,
              y: collider1.y + transform1.position.y,
              radius: collider1.radius * transform1.scale.x,
            });
            const circle2 = Circle.from({
              x: collider2.x + transform2.position.x,
              y: collider2.y + transform2.position.y,
              radius: collider2.radius * transform2.scale.x,
            });

            if (Circle.overlapsCircle(circle1, circle2)) {
              collisions.add({
                source: element1.id,
                target: element2.id,
              });
            }
          } else if (collider1 instanceof Rect && collider2 instanceof Rect) {
            const rect1 = Rect.from({
              x: collider1.x + transform1.position.x,
              y: collider1.y + transform1.position.y,
              width: collider1.width * transform1.scale.x,
              height: collider1.height * transform1.scale.y,
            });
            const rect2 = Rect.from({
              x: collider2.x + transform2.position.x,
              y: collider2.y + transform2.position.y,
              width: collider2.width * transform2.scale.x,
              height: collider2.height * transform2.scale.y,
            });

            if (Rect.overlapsRect(rect1, rect2)) {
              collisions.add({
                source: element1.id,
                target: element2.id,
              });
            }
          } else if (collider1 instanceof Circle && collider2 instanceof Rect) {
            const circle = Circle.from({
              x: collider1.x + transform1.position.x,
              y: collider1.y + transform1.position.y,
              radius: collider1.radius * transform1.scale.x,
            });
            const rect = Rect.from({
              x: collider2.x + transform2.position.x,
              y: collider2.y + transform2.position.y,
              width: collider2.width * transform2.scale.x,
              height: collider2.height * transform2.scale.y,
            });

            if (Circle.overlapsRect(circle, rect)) {
              collisions.add({
                source: element1.id,
                target: element2.id,
              });
            }
          } else if (collider1 instanceof Rect && collider2 instanceof Circle) {
            const rect = Rect.from({
              x: collider1.x + transform1.position.x,
              y: collider1.y + transform1.position.y,
              width: collider1.width * transform1.scale.x,
              height: collider1.height * transform1.scale.y,
            });
            const circle = Circle.from({
              x: collider2.x + transform2.position.x,
              y: collider2.y + transform2.position.y,
              radius: collider2.radius * transform2.scale.x,
            });

            if (Rect.overlapsCircle(rect, circle)) {
              collisions.add({
                source: element1.id,
                target: element2.id,
              });
            }
          }
        }
      }
    }
  }
}
