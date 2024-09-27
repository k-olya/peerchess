import { Entity } from "./entity-world";
import { Lifecycle } from "../lifecycle";

// abstracts entity lookup and iteration
export interface EntityDataStructure extends Lifecycle {
  set(entity: Entity): void;
  get(_id: string): Entity;
  run(): Iterable<Entity>;
  delete(_id: string): void;
  clear(): void;
}
