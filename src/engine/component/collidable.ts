import { Rect } from "@/engine/math/rect";
import { Circle } from "@/engine/math/circle";
import { Component, ComponentId } from "@/engine/component";

export type Collider = Rect | Circle;

export class Collidable implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(public readonly collider: Collider) {}
}
