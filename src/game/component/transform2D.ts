import { Vec2 } from "@/engine/math/vec2";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { Mat3x3 } from "@/engine/math/mat3x3";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Transform2D implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public readonly position: Pnt2 = new Pnt2(0, 0),
    public rotation: number = 0,
    public readonly scale = new Vec2(1, 1),
  ) {}

  public get matrix(): Mat3x3 {
    // TODO cache?
    const sin = Math.sin(this.rotation);
    const cos = Math.cos(this.rotation);

    // prettier-ignore
    return Mat3x3.from([
      this.scale.x * cos, this.scale.x * sin, 0,
      -this.scale.y * sin, this.scale.y * cos, 0,
      this.position.x, this.position.y, 1
    ]);
  }

  public translate(point: Readonly<Pnt2Like>): void {
    this.position.x += point.x;
    this.position.y += point.y;
  }

  public rescale(vector: Readonly<Pnt2Like>): void {
    this.scale.x *= vector.x;
    this.scale.y *= vector.y;
  }

  public rotate(radians: number): void {
    this.rotation = (this.rotation + radians) % (Math.PI * 2);
  }
}
