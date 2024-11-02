import { Rgba } from "@/engine/math/rgba";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Circle implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public radius: number,
    public color: Rgba,
  ) {}
}
