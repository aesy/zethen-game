import { EntityId } from "@/engine/ecs/entity";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Attached implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  // TODO deadzone

  constructor(public target: EntityId) {}
}
