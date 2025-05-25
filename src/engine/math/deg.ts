export namespace Deg {
  const MULTIPLICANT = Math.PI / 180;

  export function toRad(degrees: number): number {
    return degrees * MULTIPLICANT;
  }
}

export namespace Rad {
  const MULTIPLICANT = 180 / Math.PI;

  export function toDeg(rads: number): number {
    return rads * MULTIPLICANT;
  }
}
