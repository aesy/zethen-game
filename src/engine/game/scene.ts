import { ResourceManager } from "@/engine/resource/resourcemanager";
import { InputManager } from "@/engine/input/manager";
import { Bundle } from "@/engine/game/bundle";
import { EventBus } from "@/engine/event/eventbus";
import { SystemManager } from "@/engine/ecs/systemmanager";
import { EntityManager } from "@/engine/ecs/entitymanager";
import { AudioManager } from "@/engine/audio/audiomanager";

export class Scene {
  public readonly entities: EntityManager = new EntityManager();
  public readonly systems: SystemManager = new SystemManager(this);
  public readonly resources: ResourceManager = new ResourceManager();
  public readonly inputs: InputManager = new InputManager();
  public readonly audio: AudioManager = new AudioManager();
  public readonly events: EventBus = new EventBus();

  public addBundle(bundle: Bundle): void {
    bundle.init(this);
  }

  public dispose(): void {
    this.inputs.dispose();
  }
}
