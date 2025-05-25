import { Constructor } from "@/engine/util/type";
import { Pnt2 } from "@/engine/math/pnt2";

export class GameObject {
  private static ID_COUNTER = 0;

  public readonly id: number = GameObject.ID_COUNTER++;
  // public sprites: Sprite[] = [];
  // public colliders: Shape[] = [];
  public children: GameObject[] = [];
  public zIndex: number = -1;

  constructor(public pos: Pnt2) {}

  // public get bounds(): Bounds2 {
  //   // TODO union all colliders
  //   return { pos: this.pos, dim: { width: 0, height: 0 } };
  // }
}

export enum MovementState {
  IDLE,
  WALKING,
  RUNNING,
}

export class Player extends GameObject {
  public health: number = 0;
  public movementState: MovementState = MovementState.IDLE;
}

export class Game {
  private readonly entities: Map<Constructor<GameObject>, Set<GameObject>> =
    new Map();

  public get<T extends GameObject>(type: Constructor<T>): T[] {
    const set = this.entities.get(type);

    if (!set) {
      return [];
    }

    return Array.from(set.values()) as T[];
  }

  public add(obj: GameObject): void {
    let proto = Object.getPrototypeOf(obj);

    while (proto !== null && proto.constructor !== Object) {
      const set = this.entities.get(proto.constructor);

      if (set) {
        set.add(obj);
      } else {
        this.entities.set(proto.constructor, new Set([obj]));
      }

      proto = Object.getPrototypeOf(proto);
    }
  }

  public remove(obj: GameObject): void {
    for (const [type, set] of this.entities.entries()) {
      if (obj instanceof type) {
        set.delete(obj);
      }
    }
  }

  public run(): void {
    const dt = 0.1;

    const gameObjects = this.get(GameObject);

    // for (const object of this.entities) {
    //   object.update(this, dt);
    // }
    //
    // for (const object of this.entities) {
    //   object.draw(null!);
    // }
  }
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
const num = 3 * 2;

for (let i = 2; i < num; i++) {
  if (num % i === 0) {
    console.log("i", i);
  }
}

// https://stackoverflow.com/questions/62722889/faster-way-to-find-factors-of-n-only-using-the-math-library
