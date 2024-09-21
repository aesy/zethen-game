import { Queryable } from "@/engine/entity/query";
import {
  ComponentDescriptor,
  ComponentDescriptorToComponentValue,
  ComponentMap,
} from "@/engine/component";

export type EntityDescriptor<
  T extends Record<string, ComponentDescriptor> = Record<
    string,
    ComponentDescriptor
  >,
> = T;

export type EntityDescriptorToComponentMap<T extends EntityDescriptor> = {
  [K in keyof T as ComponentDescriptorToComponentValue<T[K]> extends Exclude<
    ComponentDescriptorToComponentValue<T[K]>,
    undefined
  >
    ? K
    : never]: ComponentDescriptorToComponentValue<T[K]>;
} & {
  [K in keyof T as ComponentDescriptorToComponentValue<T[K]> extends Exclude<
    ComponentDescriptorToComponentValue<T[K]>,
    undefined
  >
    ? never
    : K]?: ComponentDescriptorToComponentValue<T[K]>;
};

export type EntityId = number;

export type Entity<T extends ComponentMap = ComponentMap> = {
  id: EntityId;
} & T;

export type EntityOf<T extends Queryable | ComponentMap> =
  {
    id: EntityId;
  } & T extends Queryable<infer D>
    ? Entity<EntityDescriptorToComponentMap<D>>
    : T extends ComponentMap
      ? Entity<T>
      : never;

export namespace EntityId {
  let current: EntityId = 0;

  export function next(): EntityId {
    return current++;
  }
}
