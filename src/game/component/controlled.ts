import { Component, ComponentId } from "@/engine/ecs/component";

export class Controlled implements Component {
  public static readonly id: ComponentId = ComponentId.next();
}
