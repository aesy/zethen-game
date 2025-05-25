import { Constructor } from "@/engine/util/type";

export type Resource = object;

export type ResourceType<T extends Resource = Resource> = Constructor<T>;
