export type Dim2Like = {
  width: number;
  height: number;
};

export type ReadonlyDim2 = Readonly<Dim2Like> & {
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  equals(other: Readonly<Dim2Like>, epsilon?: number): boolean;
  clone(): Dim2;
  toString(): string;
};

export class Dim2 implements Dim2Like, ReadonlyDim2 {
  constructor(
    public width: number,
    public height: number,
  ) {}

  public static from(other: Readonly<Dim2Like>): Dim2 {
    return new Dim2(other.width, other.height);
  }

  public static isZero(
    dim: Readonly<Dim2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return dim.width <= epsilon && dim.height <= epsilon;
  }

  public static isNan(dim: Readonly<Dim2Like>): boolean {
    return isNaN(dim.width) || isNaN(dim.height);
  }

  public static equals(
    first: Readonly<Dim2Like>,
    second: Readonly<Dim2Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.width - second.width) <= epsilon &&
      Math.abs(first.height - second.height) <= epsilon
    );
  }

  public static copy(first: Dim2Like, second: Readonly<Dim2Like>): void {
    first.width = second.width;
    first.height = second.height;
  }

  public static clone(dim: Readonly<Dim2Like>): Dim2Like {
    return {
      width: dim.width,
      height: dim.height,
    };
  }

  public static toString(dim: Readonly<Dim2Like>): string {
    const w = dim.width.toFixed(1);
    const h = dim.height.toFixed(1);

    return `Dim2(w:${w}, h:${h})`;
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Dim2.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Dim2.isNan(this);
  }

  public equals(
    other: Readonly<Dim2Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return Dim2.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Dim2Like>): this {
    Dim2.copy(this, other);
    return this;
  }

  public clone(): Dim2 {
    return new Dim2(this.width, this.height);
  }

  public toString(): string {
    return Dim2.toString(this);
  }
}
