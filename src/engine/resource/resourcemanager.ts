import { Resource, ResourceType } from "@/engine/resource/resource";

type ResourceMap = Map<ResourceType, Resource>;

export class ResourceManager {
  private readonly resources: ResourceMap = new Map();

  public get<T extends Resource>(type: ResourceType<T>): T | null {
    return (this.resources.get(type) as T) ?? null;
  }

  public getOrSet<T extends Resource>(
    type: ResourceType<T>,
    supplier: () => T,
  ): T {
    let resource = this.get(type);

    if (resource === null) {
      resource = supplier();
      this.resources.set(type, resource);
    }

    return resource;
  }

  public set<T extends Resource>(resource: T): void {
    const type = resource.constructor as ResourceType<T>;

    this.resources.set(type, resource);
  }

  public setIfNotPresent<T extends Resource>(resource: T): void {
    const type = resource.constructor as ResourceType<T>;

    this.getOrSet(type, () => resource);
  }

  public delete<T extends Resource>(type: ResourceType<T>): boolean {
    return this.resources.delete(type);
  }

  public clear(): void {
    this.resources.clear();
  }
}
