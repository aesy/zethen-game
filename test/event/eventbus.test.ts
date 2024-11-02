import { describe, expect, it } from "vitest";
import { EventBus } from "@/engine/event/eventbus";

describe("EventBus", () => {
  class MyEvent {
    constructor(public readonly count: number) {}
  }

  describe("#register", () => {
    it("should be possible to register an event listener", () => {
      const bus = new EventBus();

      expect(() => {
        bus.register(MyEvent, console.log);
      }).not.toThrow();
    });
  });

  describe("#emit", () => {
    it("should be possible to emit an event which triggers all its' listeners", () => {
      const bus = new EventBus();
      const iterations = 3;
      const increment = 4;
      let counter = 0;

      for (let i = 0; i < iterations; i++) {
        bus.register(MyEvent, (event) => {
          counter += event.count;
        });
      }

      bus.emit(new MyEvent(increment));

      expect(counter).toEqual(iterations * increment);
    });
  });
});
