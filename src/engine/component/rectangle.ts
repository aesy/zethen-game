import { Rgba } from "@/engine/math/rgba";
import { Dim2 } from "@/engine/math/dim2";
import { Component, ComponentId } from "@/engine/component";

export class Rectangle implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public size: Dim2,
    public color: Rgba,
  ) {}
}
