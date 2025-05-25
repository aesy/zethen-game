import { Component, ComponentId } from "@/engine/ecs/component";

export class Health implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public hpTotal: number,
    public hpLeft: number = hpTotal,
  ) {}
}
