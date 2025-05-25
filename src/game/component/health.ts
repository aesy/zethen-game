import { Component, ComponentId } from "@/engine/ecs/component";

export class Health implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public readonly hpTotal: number,
    public readonly hpLeft: number = hpTotal,
  ) {}
}
