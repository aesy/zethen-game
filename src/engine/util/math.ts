export const TAU = Math.PI * 2;

export type Range = {
  min: number;
  max: number;
};

/**
 * Clamps a value to a range.
 */
export function clamp(value: number, range: Range): number {
  return Math.min(Math.max(value, range.min), range.max);
}

/**
 * Re-maps a value from one range to another.
 */
export function remap(value: number, from: Range, to: Range): number {
  return (
    ((value - from.min) / (from.max - from.min)) * (to.max - to.min) + to.min
  );
}

/**
 * Checks if the given value is a power of 2.
 */
export function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) === 0;
}
