import { Entity } from "./entity";
import { Lifecycle } from "../lifecycle";

// abstracts entity lookup and iteration
export abstract class EntityDataStructure extends Lifecycle {
  abstract set(entity: Entity): void;
  abstract get(_id: string): Entity;
  abstract onRun(): Iterable<Entity>;
  abstract delete(_id: string): void;
  abstract clear(): void;
}
