import { Component, ComponentId } from "@/engine/component";

export class ZIndex implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(public value: number = 0) {}
}
