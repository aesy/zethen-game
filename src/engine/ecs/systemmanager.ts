import { Priorityqueue } from "@/engine/util/priorityqueue";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class SystemManager {
  private readonly systems: Priorityqueue<System> = new Priorityqueue();

  constructor(private readonly scene: Scene) {}

  public getAll(): Iterable<System> {
    return this.systems;
  }

  public add(system: System): void {
    this.systems.insert(system);
    system.init?.(this.scene);
  }

  public remove(system: System): void {
    this.systems.remove(system);
  }
}
