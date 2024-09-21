import { SystemManager } from "@/engine/system/manager";
import { InputManager } from "@/engine/input/manager";
import { Bundle } from "@/engine/game/bundle";
import { EventBus } from "@/engine/event/bus";
import { EntityManager } from "@/engine/entity/manager";

export class Scene {
  public readonly entities: EntityManager = new EntityManager();
  public readonly systems: SystemManager = new SystemManager(this);
  public readonly inputs: InputManager = new InputManager();
  public readonly events: EventBus = new EventBus();

  public addBundle(bundle: Bundle): void {
    bundle.init(this);
  }

  public dispose(): void {
    this.inputs.dispose();
  }
}
