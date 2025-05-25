export type Cooldown<T extends object> = T & {
  timeLeft: number;
  isOnCooldown(): boolean;
  putOnCooldown(): void;
  decrementCooldown(dt: number): void;
};

export namespace Cooldown {
  export function of<T extends object>(value: T, time: number): Cooldown<T> {
    const cooldown = value as Cooldown<T>;
    cooldown.timeLeft = 0;
    cooldown.isOnCooldown = () => cooldown.timeLeft > 0;
    cooldown.putOnCooldown = () => {
      cooldown.timeLeft = time;
    };
    cooldown.decrementCooldown = (dt) => {
      cooldown.timeLeft = Math.max(cooldown.timeLeft - dt, 0);
    };
    return cooldown;
  }
}
