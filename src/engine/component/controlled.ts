import { Component, ComponentId } from "@/engine/component";

export class Controlled implements Component {
  public static readonly id: ComponentId = ComponentId.next();
}
