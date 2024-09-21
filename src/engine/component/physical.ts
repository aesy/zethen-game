import { Vector2 } from "@/engine/math/vector";
import { Component, ComponentId } from "@/engine/component";

export class Physical implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public mass: number,
    public velocity: Vector2 = Vector2.zero(),
  ) {}
}
