import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { Dim2 } from "@/engine/math/dim2";
import { Component, ComponentId } from "@/engine/component";

export class Transform2D implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public readonly position: Pnt2 = new Pnt2(0, 0),
    public rotation: number = 0,
    public readonly scale = new Dim2(1, 1),
  ) {}

  public translate(point: Readonly<Pnt2Like>): void {
    this.position.x += point.x;
    this.position.y += point.y;
  }

  public rescale(vector: Readonly<Pnt2Like>): void {
    this.scale.width *= vector.x;
    this.scale.height *= vector.y;
  }

  public rotate(radians: number): void {
    this.rotation = (this.rotation + radians) % (Math.PI * 2);
  }
}
