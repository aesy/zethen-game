export class Priorityqueue<T> {
  private data: [number, T][] = [];

  public insert(value: T, priority: number = Number.MAX_VALUE): void {
    if (this.data.length === 0 || priority === Number.MAX_VALUE) {
      this.data.push([priority, value]);
      return;
    }

    for (let index = 0; index < this.data.length; index++) {
      if (index === this.data.length - 1) {
        this.data.push([priority, value]);
        break;
      }

      if (this.data[index][0] > priority) {
        this.data.splice(index, 0, [priority, value]);
        break;
      }
    }
  }

  public remove(value: T): void {
    const index = this.data.findIndex(([_, other]) => other === value);

    if (index >= 0) {
      this.data.splice(index, 1);
    }
  }

  public peek(): T | null {
    return this.data[0]?.[1] ?? null;
  }

  public pop(): T | null {
    return this.data.pop()?.[1] ?? null;
  }

  public isEmpty(): boolean {
    return this.data.length === 0;
  }

  public size(): number {
    return this.data.length;
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const [_, value] of this.data) {
      yield value;
    }
  }
}
