export function lerp(a: number, b: number, n: number): number {
  return a + n * (b - a);
}

export function dampen(
  source: number,
  target: number,
  smoothing: number,
  dt: number,
): number {
  return lerp(source, target, 1 - Math.pow(smoothing, dt));
}
