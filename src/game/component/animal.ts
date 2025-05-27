import { State, StateMachine } from "@/engine/util/statemachine";
import { Vec2, Vec2Like } from "@/engine/math/vec2";
import { Component, ComponentId } from "@/engine/ecs/component";

export enum Diet {
  CARNIVORE,
  HERBIVORE,
  OMNIIVORE,
}

export class Idling {
  constructor(public time: number = 0) {}
}

export class Walking {
  constructor(public readonly direction: Readonly<Vec2Like>) {}
}

export class Fleeing {
  constructor(public readonly direction: Readonly<Vec2Like>) {}
}

export class Idle {
  constructor(public readonly dt: number) {}
}

export class Flee {
  constructor(public readonly direction: Readonly<Vec2Like>) {}
}

export type AnimalState = Idling | Walking | Fleeing;
export type AnimalAction = Idle | Flee;

export class Animal implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  public readonly fsm = new StateMachine<AnimalState, AnimalAction>(
    new Idling(),
  )
    .when(State.isType(Idling), (event, state) => {
      if (event instanceof Idle) {
        if (state.time > 5) {
          const dir = new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1)
            .normalize()
            .multiplyScalar(Math.random() * 100 + 50);

          return new Walking(dir);
        }

        return new Idling(state.time + event.dt);
      } else if (event instanceof Flee) {
        if (Vec2.getMagnitude(event.direction) < 300) {
          const dir = Vec2.from(event.direction)
            .invert()
            .normalize()
            .multiplyScalar(100);

          return new Walking(dir);
        }
      }

      return undefined;
    })
    .when(State.isType(Walking), (event) => {
      if (event instanceof Idle) {
        return new Idling(event.dt);
      }
      if (event instanceof Flee) {
        if (Vec2.getMagnitude(event.direction) < 150) {
          const dir = new Vec2(Math.random() * 0.6 - 0.3, -1)
            .normalize()
            .multiplyScalar(400);

          return new Fleeing(dir);
        }
      }

      return undefined;
    });

  constructor(public diet: Diet) {}
}
