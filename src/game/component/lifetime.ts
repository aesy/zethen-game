import { Component, ComponentId } from "@/engine/ecs/component";

export class Lifetime implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(public timeLeft: number) {}

  public get isOver(): boolean {
    return this.timeLeft <= 0;
  }

  public tick(dt: number) {
    this.timeLeft -= dt;
  }
}
