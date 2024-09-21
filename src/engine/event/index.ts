import { Constructor } from "@/engine/util/type";

export type Event = object;

export type EventType<T extends Event = Event> = Constructor<T>;
