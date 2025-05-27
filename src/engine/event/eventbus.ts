import { Event, EventType } from "@/engine/event/event";

type Callback<T extends Event> = (event: T) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap = Map<EventType, Callback<any>[]>;

export type EventHandle = {
  unregister(): void;
};

export class EventBus {
  private readonly events: EventMap = new Map();

  public register<T extends Event>(
    type: EventType<T>,
    callback: Callback<T>,
  ): EventHandle {
    const callbacks = this.events.get(type);

    if (callbacks) {
      callbacks.push(callback);
    } else {
      this.events.set(type, [callback]);
    }

    return {
      unregister: () => this.unregister(type, callback),
    };
  }

  public unregister<T extends Event>(
    type: EventType<T>,
    callback: Callback<T>,
  ): void {
    const callbacks = this.events.get(type);

    if (callbacks) {
      this.events.set(
        type,
        callbacks.filter((c) => c !== callback),
      );
    }
  }

  public once<T extends Event>(
    type: EventType<T>,
    callback: Callback<T>,
  ): EventHandle {
    const callbacks = this.events.get(type);
    const wrapper: Callback<T> = (event) => {
      callback(event);
      this.unregister(type, wrapper);
    };

    if (callbacks) {
      callbacks.push(wrapper);
    } else {
      this.events.set(type, [wrapper]);
    }

    return {
      unregister: () => this.unregister(type, wrapper),
    };
  }

  public emit<T extends Event>(event: T): void {
    const callbacks = this.events.get(event.constructor as EventType<T>);

    if (callbacks) {
      for (const callback of callbacks) {
        callback(event);
      }
    }
  }
}
