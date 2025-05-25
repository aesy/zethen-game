import { Pnt3 } from "@/engine/math/pnt3";
import { EntityId } from "@/engine/ecs/entity";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Attached implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  // TODO deadzone
  // TODO damping
  public readonly offset: Pnt3 = Pnt3.zero();

  constructor(public target: EntityId) {}
}
