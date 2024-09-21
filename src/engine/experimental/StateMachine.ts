import { Event } from "@/engine/event";
import { Constructor } from "@/engine/util/type";

type StateMachine<T, E extends Event> = {
  readonly eventTypes: Constructor<E>[];

  getCurrentState(): T;
  handleEvent(event: E): T;
  handleUpdate(dt: number): T;
};
