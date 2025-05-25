import { SparseArray } from "@/engine/util/sparsearray";
import { EntityId } from "@/engine/ecs/entity";

export type Collision = {
  source: EntityId;
  target: EntityId;
};

export class Collisions {
  private readonly collisions: SparseArray<Collision> = new SparseArray();

  public get size(): number {
    return this.collisions.size;
  }

  public add(collision: Collision): void {
    this.collisions.push(collision);
  }

  public delete(collision: Collision): void {
    const key = this.collisions.keyOf(collision);

    if (key > -1) {
      return;
    }

    this.collisions.delete(key);
  }

  public clear(): void {
    this.collisions.clear();
  }

  public *[Symbol.iterator](): Iterator<Collision> {
    for (const collision of this.collisions) {
      yield collision;
    }
  }
}
