/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Queryable, QueryId } from "@/engine/ecs/query";
import { EntityDescriptor } from "@/engine/ecs/entity";
import {
  Component,
  ComponentConstructor,
  Constraint,
} from "@/engine/ecs/component";

class ArchetypeBuilder<T extends EntityDescriptor = EntityDescriptor> {
  constructor(private descriptor: T) {}

  public none<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): ArchetypeBuilder<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.NONE;
      };
    }
  > {
    // @ts-ignore
    return new ArchetypeBuilder({
      ...this.descriptor,
      [name]: { type, constraint: Constraint.NONE },
    });
  }

  public single<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): ArchetypeBuilder<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.SINGLE;
      };
    }
  > {
    // @ts-ignore
    return new ArchetypeBuilder({
      ...this.descriptor,
      [name]: { type, constraint: Constraint.SINGLE },
    });
  }

  public varying<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): ArchetypeBuilder<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.VARYING;
      };
    }
  > {
    // @ts-ignore
    return new ArchetypeBuilder({
      ...this.descriptor,
      [name]: { type, constraint: Constraint.VARYING },
    });
  }

  public optional<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): ArchetypeBuilder<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.OPTIONAL;
      };
    }
  > {
    // @ts-ignore
    return new ArchetypeBuilder({
      ...this.descriptor,
      [name]: { type, constraint: Constraint.OPTIONAL },
    });
  }

  public build(): Archetype<T> {
    return new Archetype(this.descriptor);
  }
}

export class Archetype<T extends EntityDescriptor = EntityDescriptor>
  implements Queryable<T>
{
  public readonly id: QueryId;

  public getDescriptor(): T {
    return this.descriptor;
  }

  constructor(private descriptor: T) {
    this.id = QueryId.fromDescriptor(descriptor);
  }

  public static builder(): ArchetypeBuilder<{}> {
    return new ArchetypeBuilder({});
  }
}
