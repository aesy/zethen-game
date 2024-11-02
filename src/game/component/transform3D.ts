import { Pnt3, Pnt3Like } from "@/engine/math/pnt3";
import { Dim3 } from "@/engine/math/dim3";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Transform3D implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public readonly position: Pnt3,
    public rotation: number = 0,
    public readonly scale = new Dim3(1, 1, 1),
  ) {}

  public translate(point: Readonly<Pnt3Like>): void {
    this.position.x += point.x;
    this.position.y += point.y;
  }

  public rescale(vector: Readonly<Pnt3Like>): void {
    this.scale.width *= vector.x;
    this.scale.height *= vector.y;
  }

  public rotate(radians: number): void {
    this.rotation = (this.rotation + radians) % (Math.PI * 2);
  }
}
