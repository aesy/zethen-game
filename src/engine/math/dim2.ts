export type Dim2Like = {
  width: number;
  height: number;
};

export type ReadonlyDim2 = Readonly<Dim2Like> & {
  equals(other: Readonly<Dim2Like>, epsilon?: number): boolean;
  isNan(): boolean;
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

  public equals(
    other: Readonly<Dim2Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(this.width - other.width) < epsilon &&
      Math.abs(this.height - other.height) < epsilon
    );
  }

  public isNan(): boolean {
    return isNaN(this.width) || isNaN(this.height);
  }

  public copy(other: Readonly<Dim2Like>): this {
    this.width = other.width;
    this.height = other.height;
    return this;
  }

  public clone(): Dim2 {
    return new Dim2(this.width, this.height);
  }

  public toString(): string {
    const width = this.width.toFixed(1);
    const height = this.height.toFixed(1);

    return `Dim2(w:${width}, h:${height})`;
  }
}
