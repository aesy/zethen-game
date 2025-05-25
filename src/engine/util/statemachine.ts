import { Constructor } from "@/engine/util/type";
import { PriorityQueue } from "@/engine/util/priorityqueue";
import { Objects } from "@/engine/util/objects";

export class State<S> {
  private constructor(
    private readonly matcher: (state: unknown) => boolean,
    private readonly priority: number,
  ) {}

  public static deepEquals<S>(state: S): State<S> {
    return new State((s) => Objects.deepEquals(state, s), 200);
  }

  public static matches<S>(state: S): State<S> {
    return new State((s) => Objects.partiallyEquals(state, s), 300);
  }

  public static equals<S>(state: S): State<S> {
    return new State((s) => s === state, 400);
  }

  public static isType<S>(type: Constructor<S>): State<S> {
    return new State((s) => s instanceof type, 500);
  }

  public getPriority(): number {
    return this.priority;
  }

  public isMatch(state: unknown): state is S {
    return this.matcher(state);
  }
}

export class StateMachine<S, E> {
  private state: S;
  private readonly transitions: PriorityQueue<[State<unknown>, Function]> =
    new PriorityQueue();

  public constructor(initialState: S) {
    this.state = initialState;
  }

  public getState(): S {
    return this.state;
  }

  public when<T extends S>(
    state: T | State<T>,
    fn: (event: E, state: T) => S | undefined,
  ): this {
    let matcher: State<T>;
    if (state instanceof State) {
      matcher = state;
    } else {
      matcher = State.equals(state);
    }

    this.transitions.push([matcher, fn], matcher.getPriority());

    return this;
  }

  public trigger(event: E): S | undefined {
    for (const [matcher, fn] of this.transitions) {
      if (matcher.isMatch(this.state)) {
        const newState = fn(event, this.state);

        if (newState !== undefined) {
          this.state = newState;
          return this.state;
        }
      }
    }

    return undefined;
  }
}
