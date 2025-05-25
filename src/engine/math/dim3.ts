export type Dim3Like = {
  width: number;
  height: number;
  depth: number;
};

export type ReadonlyDim3 = Readonly<Dim3Like> & {
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  equals(other: Readonly<Dim3Like>, epsilon?: number): boolean;
  clone(): Dim3;
  toString(): string;
};

export class Dim3 implements Dim3Like, ReadonlyDim3 {
  constructor(
    public width: number,
    public height: number,
    public depth: number,
  ) {}

  public static from(other: Readonly<Dim3Like>): Dim3 {
    return new Dim3(other.width, other.height, other.depth);
  }

  public static isZero(
    dim: Readonly<Dim3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return dim.width <= epsilon && dim.height <= epsilon;
  }

  public static isNan(dim: Readonly<Dim3Like>): boolean {
    return isNaN(dim.width) || isNaN(dim.height);
  }

  public static equals(
    first: Readonly<Dim3Like>,
    second: Readonly<Dim3Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.width - second.width) <= epsilon &&
      Math.abs(first.height - second.height) <= epsilon &&
      Math.abs(first.depth - second.depth) <= epsilon
    );
  }

  public static copy(first: Dim3Like, second: Readonly<Dim3Like>): void {
    first.width = second.width;
    first.height = second.height;
    first.depth = second.depth;
  }

  public static clone(dim: Readonly<Dim3Like>): Dim3Like {
    return {
      width: dim.width,
      height: dim.height,
      depth: dim.depth,
    };
  }

  public static toString(dim: Readonly<Dim3Like>): string {
    const w = dim.width.toFixed(1);
    const h = dim.height.toFixed(1);
    const d = dim.depth.toFixed(1);

    return `Dim3(w:${w}, h:${h}, d:${d})`;
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Dim3.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Dim3.isNan(this);
  }

  public equals(
    other: Readonly<Dim3Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return Dim3.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Dim3Like>): this {
    Dim3.copy(this, other);
    return this;
  }

  public clone(): Dim3 {
    return new Dim3(this.width, this.height, this.depth);
  }

  public toString(): string {
    return Dim3.toString(this);
  }
}
