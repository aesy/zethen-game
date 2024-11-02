import { Constructor } from "@/engine/util/type";

export type ComponentConstructor<T extends Component = Component> =
  Constructor<T> & {
    readonly id: ComponentId;
  };

export type Component = object;

export type ComponentValue = undefined | Component | Component[];

export type ComponentMap = Record<string, ComponentValue>;

export enum Constraint {
  OPTIONAL = 0b00,
  NONE = 0b01,
  SINGLE = 0b10,
  VARYING = 0b11,
}

export type ComponentDescriptor<
  T extends Component = Component,
  U extends Constraint = Constraint,
> = {
  type: ComponentConstructor<T>;
  constraint: U;
};

interface ConstraintMap<T extends Component = Component> {
  [Constraint.NONE]: never;
  [Constraint.OPTIONAL]: T | undefined;
  [Constraint.SINGLE]: T;
  [Constraint.VARYING]: T[];
}

export type ComponentDescriptorToComponentValue<T extends ComponentDescriptor> =
  T extends ComponentDescriptor<infer C, infer U> ? ConstraintMap<C>[U] : never;

export type ComponentId = number;

export namespace ComponentId {
  let current: ComponentId = 0;

  export function next(): ComponentId {
    return current++;
  }

  export function fromComponent(component: Component): ComponentId {
    const constructor = component.constructor as ComponentConstructor;
    const componentId = constructor.id;

    if (componentId === undefined) {
      throw new Error(
        `Given component of type '${constructor.name}' does not have a component constructor.`,
      );
    }

    return componentId;
  }
}
