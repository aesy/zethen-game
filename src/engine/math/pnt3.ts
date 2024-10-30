export type Pnt3Like = {
  x: number;
  y: number;
  z: number;
};

export type ReadonlyPnt3 = Readonly<Pnt3Like> & {
  distanceTo(other: Readonly<Pnt3Like>): number;
  distanceToSquared(other: Readonly<Pnt3Like>): number;
  equals(other: Readonly<Pnt3Like>, epsilon?: number): boolean;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  clone(): Pnt3;
  toString(): string;
};

export class Pnt3 implements Pnt3Like, ReadonlyPnt3 {
  public static ORIGIN: ReadonlyPnt3 = Pnt3.zero();

  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public static from(other: Readonly<Pnt3Like>): Pnt3 {
    return new Pnt3(other.x, other.y, other.z);
  }

  public static zero(): Pnt3 {
    return new Pnt3(0, 0, 0);
  }

  public static add(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3 {
    return Pnt3.from(first).add(second);
  }

  public static addScalar(point: Readonly<Pnt3Like>, scalar: number): Pnt3 {
    return Pnt3.from(point).addScalar(scalar);
  }

  public static subtract(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3 {
    return Pnt3.from(first).subtract(second);
  }

  public static subtractScalar(
    point: Readonly<Pnt3Like>,
    scalar: number,
  ): Pnt3 {
    return Pnt3.from(point).subtractScalar(scalar);
  }

  public static multiply(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3 {
    return Pnt3.from(first).multiply(second);
  }

  public static multiplyScalar(
    point: Readonly<Pnt3Like>,
    scalar: number,
  ): Pnt3 {
    return Pnt3.from(point).multiplyScalar(scalar);
  }

  public static divide(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3 {
    return Pnt3.from(first).divide(second);
  }

  public static divideScalar(point: Readonly<Pnt3Like>, scalar: number): Pnt3 {
    return Pnt3.from(point).divideScalar(scalar);
  }

  public static distanceBetween(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): number {
    return Math.sqrt(Pnt3.distanceBetweenSquared(first, second));
  }

  public static distanceBetweenSquared(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): number {
    const dx = first.x - second.x;
    const dy = first.y - second.y;
    const dz = first.z - second.z;

    return Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2);
  }

  public static isZero(
    point: Readonly<Pnt3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Pnt3.equals(Pnt3.ORIGIN, point, epsilon);
  }

  public static isNan(point: Readonly<Pnt3Like>): boolean {
    return isNaN(point.x) || isNaN(point.y) || isNaN(point.z);
  }

  public static equals(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon &&
      Math.abs(first.z - second.z) < epsilon
    );
  }

  public add(other: Readonly<Pnt3Like>): this {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public addScalar(other: number): this {
    this.x += other;
    this.y += other;
    this.z += other;
    return this;
  }

  public subtract(other: Readonly<Pnt3Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  public subtractScalar(other: number): this {
    this.x -= other;
    this.y -= other;
    this.z -= other;
    return this;
  }

  public multiply(other: Readonly<Pnt3Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  public multiplyScalar(other: number): this {
    this.x *= other;
    this.y *= other;
    this.z *= other;
    return this;
  }

  public divide(other: Readonly<Pnt3Like>): this {
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    return this;
  }

  public divideScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  public distanceTo(other: Readonly<Pnt3Like>): number {
    return Pnt3.distanceBetween(this, other);
  }

  public distanceToSquared(other: Readonly<Pnt3Like>): number {
    return Pnt3.distanceBetweenSquared(this, other);
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Pnt3.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Pnt3.isNan(this);
  }

  public equals(other: Readonly<Pnt3Like>, epsilon = Number.EPSILON): boolean {
    return Pnt3.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Pnt3Like>): this {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  public clone(): Pnt3 {
    return new Pnt3(this.x, this.y, this.z);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);
    const z = this.z.toFixed(1);

    return `Pnt3(x:${x}, y:${y}, z:${z})`;
  }
}
