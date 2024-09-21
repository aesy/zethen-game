import { Vector2 } from "@/engine/math/vector";
import { Point2 } from "@/engine/math/point";
import { Dimension2 } from "@/engine/math/dimension";
import { Component, ComponentId } from "@/engine/component";

export class Transform implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public readonly position: Point2,
    public rotation: number = 0,
    public readonly scale: Dimension2 = { width: 1, height: 1 },
  ) {}

  public translate(point: Point2): void {
    this.position.x += point.x;
    this.position.y += point.y;
  }

  public rescale(vector: Vector2): void {
    this.scale.width *= vector.x;
    this.scale.height *= vector.y;
  }

  public rotate(radians: number): void {
    this.rotation = (this.rotation + radians) % (Math.PI * 2);
  }
}
