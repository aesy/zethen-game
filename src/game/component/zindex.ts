import { Component, ComponentId } from "@/engine/ecs/component";

export class ZIndex implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(public value: number = 0) {}
}
