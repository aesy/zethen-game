import { PriorityQueue } from "@/engine/util/priorityqueue";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class SystemManager {
  private readonly systems: PriorityQueue<System> = new PriorityQueue();

  constructor(private readonly scene: Scene) {}

  public getAll(): Iterable<System> {
    return this.systems;
  }

  public add(system: System, priority?: number): void {
    this.systems.push(system, priority);
    system.init?.(this.scene);
  }

  public remove(system: System): void {
    this.systems.remove(system);
  }
}
