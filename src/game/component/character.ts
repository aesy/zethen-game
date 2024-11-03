import { Component, ComponentId } from "@/engine/ecs/component";

export enum LocationState {
  GROUNDED,
  AIRBORNE,
  SUBMERGED,
}

export enum FacingDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum MovementState {
  IDLE,
  WALKING,
  RUNNING,
  JUMPING,
  GLIDING,
  FALLING,
}

export class Character implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public locationState: LocationState,
    public movementState: MovementState,
    public facingDirection: FacingDirection,
  ) {}
}
