/* eslint-disable @typescript-eslint/ban-ts-comment */

import { EntityDescriptor } from "@/engine/ecs/entity";
import {
  Component,
  ComponentConstructor,
  Constraint,
  ComponentId,
} from "@/engine/ecs/component";

export type Queryable<T extends EntityDescriptor = EntityDescriptor> = {
  id: QueryId;
  getDescriptor(): T;
};

export type QueryId = bigint;

export namespace QueryId {
  export function fromDescriptor(descriptor: EntityDescriptor): QueryId {
    return Object.values(descriptor).reduce((id, descriptor) => {
      return QueryId.addConstraint(
        id,
        descriptor.type.id,
        descriptor.constraint,
      );
    }, 0n);
  }

  export function addConstraint(
    queryId: QueryId,
    componentId: ComponentId,
    constraint: Constraint,
  ): QueryId {
    return queryId | (BigInt(constraint) << (BigInt(componentId) * 2n));
  }

  export function getConstraint(
    queryId: QueryId,
    componentId: ComponentId,
  ): Constraint {
    return Number((queryId >> (BigInt(componentId) * 2n)) & 0b11n);
  }

  export function matches(
    queryId: QueryId,
    components: ComponentId[],
  ): boolean {
    let component = 0;

    while (queryId !== 0n) {
      const constraint: Constraint = Number(queryId & 0b11n);

      if (constraint === Constraint.NONE && components.includes(component)) {
        return false;
      }

      if (constraint === Constraint.SINGLE && !components.includes(component)) {
        return false;
      }

      queryId >>= 2n;
      component++;
    }

    return true;
  }
}

export class Query<T extends EntityDescriptor> implements Queryable<T> {
  public static readonly ALL: Queryable<{}> = new Query({});

  public id: QueryId;

  public getDescriptor(): T {
    return this.descriptor;
  }

  private constructor(private descriptor: T) {
    this.id = QueryId.fromDescriptor(descriptor);
  }

  public static create(): Query<{}> {
    return new Query({});
  }

  public static from<T extends EntityDescriptor>(
    queryable: Queryable<T>,
  ): Query<T> {
    const descriptor = Object.assign({}, queryable.getDescriptor());

    return new Query(descriptor);
  }

  public static pickFrom<T extends EntityDescriptor, K extends keyof T>(
    queryable: Queryable<T>,
    ...keys: K[]
  ): Query<Pick<T, K>> {
    const descriptor = queryable.getDescriptor();
    const newDescriptor = {} as Pick<T, K>;

    for (const key of keys) {
      newDescriptor[key] = descriptor[key];
    }

    return new Query(newDescriptor);
  }

  public static omitFrom<T extends EntityDescriptor, K extends keyof T>(
    queryable: Queryable<T>,
    ...keys: K[]
  ): Query<Omit<T, K>> {
    const newDescriptor = Object.assign({}, queryable.getDescriptor());

    for (const key of keys) {
      delete newDescriptor[key];
    }

    return new Query(newDescriptor as Omit<T, K>);
  }

  public none<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): Query<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.NONE;
      };
    }
  > {
    // @ts-ignore
    this.descriptor[name] = {
      type,
      constraint: Constraint.NONE,
    };
    this.id = QueryId.addConstraint(this.id, type.id, Constraint.NONE);
    // @ts-ignore
    return this;
  }

  public single<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): Query<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.SINGLE;
      };
    }
  > {
    // @ts-ignore
    this.descriptor[name] = {
      type,
      constraint: Constraint.SINGLE,
    };
    this.id = QueryId.addConstraint(this.id, type.id, Constraint.SINGLE);
    // @ts-ignore
    return this;
  }

  public varying<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): Query<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.VARYING;
      };
    }
  > {
    // @ts-ignore
    this.descriptor[name] = {
      type,
      constraint: Constraint.VARYING,
    };
    this.id = QueryId.addConstraint(this.id, type.id, Constraint.VARYING);
    // @ts-ignore
    return this;
  }

  public optional<S extends string, C extends Component>(
    name: S,
    type: ComponentConstructor<C>,
  ): Query<
    Omit<T, S> & {
      [key in S]: {
        type: ComponentConstructor<C>;
        constraint: Constraint.OPTIONAL;
      };
    }
  > {
    // @ts-ignore
    this.descriptor[name] = {
      type,
      constraint: Constraint.OPTIONAL,
    };
    this.id = QueryId.addConstraint(this.id, type.id, Constraint.OPTIONAL);
    // @ts-ignore
    return this;
  }
}
