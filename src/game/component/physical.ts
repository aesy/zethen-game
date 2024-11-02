import { Vec2 } from "@/engine/math/vec2";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Physical implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public mass: number,
    public velocity: Vec2 = Vec2.zero(),
  ) {}
}
