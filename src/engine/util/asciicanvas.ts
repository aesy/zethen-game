export class AsciiCanvas {
  private readonly width: number;
  private readonly height: number;
  private readonly buffer: string[];

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buffer = Array(width * height).fill(" ");
  }

  public setPixel(x: number, y: number, char: string): void {
    x = Math.floor(x);
    y = Math.floor(y);
    if (
      x < 0 ||
      x > this.width - 1 ||
      y < 0 ||
      y > this.height - 1 ||
      char.length !== 1
    ) {
      return;
    }

    const flippedY = this.height - 1 - y;
    this.buffer[x + flippedY * this.width] = char;
  }

  public toString(): string {
    let result = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        result += this.buffer[x + y * this.width];
      }
      result += "\n";
    }

    return result;
  }
}
