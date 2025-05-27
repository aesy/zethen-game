export type Cooldown<T extends object> = T & {
  timeLeft: number;
  isOnCooldown(): boolean;
  resetCooldown(): void;
  putOnCooldown(): void;
  decrementCooldown(dt: number): void;
};

export namespace Cooldown {
  export function of<T extends object>(value: T, time: number): Cooldown<T> {
    if (time < 0) {
      throw new Error("Cooldown time must be non-negative");
    }

    let onCooldown = false;
    const cooldown = value as Cooldown<T>;
    cooldown.timeLeft = 0;
    cooldown.isOnCooldown = () => onCooldown;
    cooldown.resetCooldown = () => {
      cooldown.timeLeft = 0;
      onCooldown = false;
    };
    cooldown.putOnCooldown = () => {
      if (!onCooldown) {
        cooldown.timeLeft = time;
        onCooldown = true;
      }
    };
    cooldown.decrementCooldown = (dt) => {
      cooldown.timeLeft = Math.max(cooldown.timeLeft - dt, 0);
    };
    return cooldown;
  }
}
