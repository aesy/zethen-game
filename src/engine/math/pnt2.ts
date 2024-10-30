export type Pnt2Like = {
  x: number;
  y: number;
};

export type ReadonlyPnt2 = Readonly<Pnt2Like> & {
  distanceTo(other: Readonly<Pnt2Like>): number;
  distanceToSquared(other: Readonly<Pnt2Like>): number;
  equals(other: Readonly<Pnt2Like>, epsilon?: number): boolean;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  clone(): Pnt2;
  toString(): string;
};

export class Pnt2 implements Pnt2Like, ReadonlyPnt2 {
  public static ORIGIN: ReadonlyPnt2 = Pnt2.zero();

  constructor(
    public x: number,
    public y: number,
  ) {}

  public static from(other: Readonly<Pnt2Like>): Pnt2 {
    return new Pnt2(other.x, other.y);
  }

  public static zero(): Pnt2 {
    return new Pnt2(0, 0);
  }

  public static angle(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): number {
    // TODO correct?
    return Math.atan2(second.y - first.y, second.x - first.x);
  }

  public static add(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2 {
    return Pnt2.from(first).add(second);
  }

  public static addScalar(point: Readonly<Pnt2Like>, scalar: number): Pnt2 {
    return Pnt2.from(point).addScalar(scalar);
  }

  public static subtract(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2 {
    return Pnt2.from(first).subtract(second);
  }

  public static subtractScalar(
    point: Readonly<Pnt2Like>,
    scalar: number,
  ): Pnt2 {
    return Pnt2.from(point).subtractScalar(scalar);
  }

  public static multiply(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2 {
    return Pnt2.from(first).multiply(second);
  }

  public static multiplyScalar(
    point: Readonly<Pnt2Like>,
    scalar: number,
  ): Pnt2 {
    return Pnt2.from(point).multiplyScalar(scalar);
  }

  public static divide(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2 {
    return Pnt2.from(first).divide(second);
  }

  public static divideScalar(point: Readonly<Pnt2Like>, scalar: number): Pnt2 {
    return Pnt2.from(point).divideScalar(scalar);
  }

  public static distanceBetween(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): number {
    return Math.sqrt(Pnt2.distanceBetweenSquared(first, second));
  }

  public static distanceBetweenSquared(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): number {
    const dx = first.x - second.x;
    const dy = first.y - second.y;

    return Math.pow(dx, 2) + Math.pow(dy, 2);
  }

  public static isZero(
    point: Readonly<Pnt2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Pnt2.equals(Pnt2.ORIGIN, point, epsilon);
  }

  public static isNan(point: Readonly<Pnt2Like>): boolean {
    return isNaN(point.x) || isNaN(point.y);
  }

  public static equals(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon
    );
  }

  public add(other: Readonly<Pnt2Like>): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public addScalar(scalar: number): this {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  public subtract(other: Readonly<Pnt2Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public subtractScalar(scalar: number): this {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  public multiply(other: Readonly<Pnt2Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public divide(other: Readonly<Pnt2Like>): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  public divideScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  public distanceTo(other: Readonly<Pnt2Like>): number {
    return Pnt2.distanceBetween(this, other);
  }

  public distanceToSquared(other: Readonly<Pnt2Like>): number {
    return Pnt2.distanceBetweenSquared(this, other);
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Pnt2.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Pnt2.isNan(this);
  }

  public equals(other: Readonly<Pnt2Like>, epsilon = Number.EPSILON): boolean {
    return Pnt2.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Pnt2Like>): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  public clone(): Pnt2 {
    return new Pnt2(this.x, this.y);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);

    return `Pnt2(x:${x}, y:${y})`;
  }
}
