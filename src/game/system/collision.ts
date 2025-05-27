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
      x: 0,
      y: 0,
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

      const bounds = collider
        .getBoundingRect()
        .transform(transform.matrix.data);

      qTree.insert({
        ...movable,
        ...bounds,
      });
    }

    // Narrow phase
    // for (const node of qTree.getLeafNodes()) {
    //   const elements = node.getElements();
    const elements = movables;

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
          const circle1 = collider1.clone().transform(transform1.matrix.data);
          const circle2 = collider2.clone().transform(transform2.matrix.data);

          if (Circle.overlapsCircle(circle1, circle2)) {
            collisions.add({
              source: element1.id,
              target: element2.id,
            });
          }
        } else if (collider1 instanceof Rect && collider2 instanceof Rect) {
          const rect1 = collider1.clone().transform(transform1.matrix.data);
          const rect2 = collider2.clone().transform(transform2.matrix.data);

          if (Rect.overlapsRect(rect1, rect2)) {
            collisions.add({
              source: element1.id,
              target: element2.id,
            });
          }
        } else if (collider1 instanceof Circle && collider2 instanceof Rect) {
          const circle = collider1.clone().transform(transform1.matrix.data);
          const rect = collider2.clone().transform(transform2.matrix.data);

          if (Circle.overlapsRect(circle, rect)) {
            collisions.add({
              source: element1.id,
              target: element2.id,
            });
          }
        } else if (collider1 instanceof Rect && collider2 instanceof Circle) {
          const rect = collider1.clone().transform(transform1.matrix.data);
          const circle = collider2.clone().transform(transform2.matrix.data);

          if (Rect.overlapsCircle(rect, circle)) {
            collisions.add({
              source: element1.id,
              target: element2.id,
            });
          }
        }
      }
    }
    // }
  }
}
