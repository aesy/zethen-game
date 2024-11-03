export class FpsCounter {
  private measurement: number = 0;

  constructor(private readonly decay: number = 1) {}

  public get currentFps(): number {
    if (!this.measurement) {
      return 0;
    }

    return 1 / this.measurement;
  }

  public tick(dt: number): void {
    if (this.measurement) {
      // TODO smoothing is frame dependent
      this.measurement = this.measurement * (1 - this.decay) + dt * this.decay;
    } else {
      this.measurement = dt;
    }
  }

  public reset(): void {
    this.measurement = 0;
  }
}
