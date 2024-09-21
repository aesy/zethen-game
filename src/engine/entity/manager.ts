import { Queryable, QueryId } from "@/engine/entity/query";
import {
  Entity,
  EntityDescriptor,
  EntityDescriptorToComponentMap,
  EntityId,
} from "@/engine/entity";
import {
  Component,
  ComponentConstructor,
  Constraint,
  ComponentId,
} from "@/engine/component";
import { Archetype } from "@/engine/archetype";

export class EntityManager {
  private componentsByEntity = new Map<
    EntityId,
    Map<ComponentId, Component[]>
  >();
  private entitiesByComponent = new Map<ComponentId, Set<EntityId>>();
  private cachedQueries = new Map<QueryId, Set<EntityId>>();

  public createEntity(components?: Component[]): EntityId {
    const entityId = EntityId.next();
    this.componentsByEntity.set(entityId, new Map());

    if (components) {
      for (const component of components) {
        this.addComponent(entityId, component);
      }
    }

    return entityId;
  }

  public createArchetype<T extends EntityDescriptor>(
    archetype: Archetype<T>,
    components: EntityDescriptorToComponentMap<T>,
  ): EntityId {
    const entityId = this.createEntity(Object.values(components));
    const entities = this.cachedQueries.get(archetype.id);

    if (entities) {
      entities.add(entityId);
    } else {
      this.cachedQueries.set(archetype.id, new Set([entityId]));
    }

    return entityId;
  }

  public deleteEntity(entityId: EntityId): void {
    this.componentsByEntity.delete(entityId);

    for (const entities of this.entitiesByComponent.values()) {
      entities.delete(entityId);
    }

    for (const entities of this.cachedQueries.values()) {
      entities.delete(entityId);
    }
  }

  public addComponent(entityId: EntityId, component: Component): void {
    const componentId = ComponentId.fromComponent(component);
    const entities = this.entitiesByComponent.get(componentId);

    if (entities) {
      entities.add(entityId);
    } else {
      this.entitiesByComponent.set(componentId, new Set([entityId]));
    }

    const componentMap = this.componentsByEntity.get(entityId);

    if (!componentMap) {
      console.warn(
        `Tried to add component '${componentId}' to unknown entity '${entityId}'`,
      );
      return;
    }

    const components = componentMap.get(componentId);

    if (components) {
      components.push(component);
    } else {
      componentMap.set(componentId, [component]);
    }

    const componentTypes = Array.from(componentMap.keys());

    for (const [query, entities] of this.cachedQueries.entries()) {
      if (entities.has(entityId)) {
        const constraint = QueryId.getConstraint(query, componentId);

        if (constraint === Constraint.NONE) {
          entities.delete(entityId);
        }
      } else {
        const matches = QueryId.matches(query, componentTypes);

        if (matches) {
          entities.add(entityId);
        }
      }
    }
  }

  public removeComponent<T extends Component>(
    entityId: EntityId,
    component: T,
  ): void {
    const componentId = ComponentId.fromComponent(component);
    this.entitiesByComponent.get(componentId)?.delete(entityId);
    const componentMap = this.componentsByEntity.get(entityId);
    componentMap?.delete(componentId);

    const componentTypes = Array.from(componentMap?.keys() ?? []);

    for (const [query, entities] of this.cachedQueries.entries()) {
      if (entities.has(entityId)) {
        const constraint = QueryId.getConstraint(query, componentId);

        if (constraint === Constraint.SINGLE) {
          entities.delete(entityId);
        }
      } else {
        const matches = QueryId.matches(query, componentTypes);

        if (matches) {
          entities.add(entityId);
        }
      }
    }
  }

  public getFirstComponent<T extends Component>(
    entityId: EntityId,
    componentType: ComponentConstructor<T>,
  ): T | null {
    const component =
      this.componentsByEntity.get(entityId)?.get(componentType.id)?.[0] ?? null;

    return component as T | null;
  }

  public getAllComponents<T extends Component>(
    entityId: EntityId,
    componentType?: ComponentConstructor<T>,
  ): T[] {
    const componentMap = this.componentsByEntity.get(entityId);
    let components: Component[];

    if (componentMap) {
      if (componentType) {
        components = componentMap.get(componentType.id) ?? [];
      } else {
        components = Array.from(componentMap.values() ?? []).flat();
      }
    } else {
      components = [];
    }

    return components as T[];
  }

  public getAllEntities(): EntityId[] {
    return Array.from(this.componentsByEntity.keys());
  }

  public queryFirstEntity<T extends EntityDescriptor>(
    query: Queryable<T>,
  ): Entity<EntityDescriptorToComponentMap<T>> | null {
    const cachedEntities = this.cachedQueries.get(query.id);
    let entityId: EntityId | null;

    if (cachedEntities) {
      entityId = cachedEntities.values().find(() => true) ?? null;
    } else {
      const entities = this.getAllMatchingEntities(query.id);

      this.cachedQueries.set(query.id, new Set(entities));

      entityId = entities[0] ?? null;
    }

    if (entityId === null) {
      return null;
    }

    return this.constructEntity(entityId, query.getDescriptor());
  }

  public queryAllEntities<T extends EntityDescriptor>(
    query: Queryable<T>,
  ): Entity<EntityDescriptorToComponentMap<T>>[] {
    const cachedEntities = this.cachedQueries.get(query.id);
    let entities: EntityId[];

    if (cachedEntities) {
      entities = Array.from(cachedEntities.values());
    } else {
      entities = this.getAllMatchingEntities(query.id);

      this.cachedQueries.set(query.id, new Set(entities));
    }

    return entities.map((entityId) =>
      this.constructEntity(entityId, query.getDescriptor()),
    );
  }

  private getAllMatchingEntities(queryId: QueryId): EntityId[] {
    return this.componentsByEntity
      .entries()
      .reduce((arr, [entityId, componentMap]) => {
        const componentTypes = Array.from(componentMap.keys());

        if (QueryId.matches(queryId, componentTypes)) {
          arr.push(entityId);
        }

        return arr;
      }, [] as EntityId[]);
  }

  private constructEntity<T extends EntityDescriptor>(
    entityId: EntityId,
    descriptor: T,
  ): Entity<EntityDescriptorToComponentMap<T>> {
    const entity = { id: entityId } as Record<string, unknown>;

    for (const [name, definition] of Object.entries(descriptor)) {
      switch (definition.constraint) {
        case Constraint.VARYING:
          entity[name] = this.getAllComponents(entityId, definition.type);
          break;
        case Constraint.OPTIONAL:
          entity[name] = this.getFirstComponent(entityId, definition.type);
          break;
        case Constraint.SINGLE:
          entity[name] = this.getFirstComponent(entityId, definition.type);

          if (!entity[name]) {
            throw new Error(
              `Mandatory component '${name}' is missing in entity '${entityId}'.`,
            );
          }
          break;
        case Constraint.NONE:
          throw new Error(
            `Non-required component '${name}' is present in entity '${entityId}'.`,
          );
        default:
          throw new Error(`Unknown contraint: '${definition.constraint}'.`);
      }
    }

    return entity as Entity<EntityDescriptorToComponentMap<T>>;
  }
}
