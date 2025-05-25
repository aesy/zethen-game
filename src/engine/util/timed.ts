export type Timed<T extends object> = T & {
  timeElapsed: number;
  resetTimeElapsed(): void;
  incrementTimeElapsed(dt: number): void;
};

export namespace Timed {
  export function of<T extends object>(value: T): Timed<T> {
    const timed = value as Timed<T>;
    timed.timeElapsed = 0;
    timed.resetTimeElapsed = () => {
      timed.timeElapsed = 0;
    };
    timed.incrementTimeElapsed = (dt) => {
      timed.timeElapsed += dt;
    };
    return timed;
  }
}
