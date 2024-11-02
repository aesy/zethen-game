export type Dim3Like = {
  width: number;
  height: number;
  depth: number;
};

export type ReadonlyDim3 = Readonly<Dim3Like> & {
  equals(other: Readonly<Dim3Like>, epsilon?: number): boolean;
  isNan(): boolean;
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

  public equals(
    other: Readonly<Dim3Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(this.width - other.width) < epsilon &&
      Math.abs(this.height - other.height) < epsilon &&
      Math.abs(this.depth - other.depth) < epsilon
    );
  }

  public isNan(): boolean {
    return isNaN(this.width) || isNaN(this.height) || isNaN(this.depth);
  }

  public copy(other: Readonly<Dim3Like>): this {
    this.width = other.width;
    this.height = other.height;
    this.depth = other.depth;
    return this;
  }

  public clone(): Dim3 {
    return new Dim3(this.width, this.height, this.depth);
  }

  public toString(): string {
    const width = this.width.toFixed(1);
    const height = this.height.toFixed(1);
    const depth = this.depth.toFixed(1);

    return `Dim3(w:${width}, h:${height}, d:${depth})`;
  }
}
