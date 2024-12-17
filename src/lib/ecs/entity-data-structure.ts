import { Entity } from "./entity";
import { Lifecycle } from "../lifecycle";

// abstracts entity lookup and iteration
export abstract class EntityDataStructure extends Lifecycle<
  IterableIterator<Entity>
> {
  // TODO: find a better way to handle initial entities
  private initial: Entity[] = [];
  create() {
    if (this.initial.length) {
      for (const entity of this.initial) {
        this.set(entity);
      }
      this.initial = [];
    }
    super.create();
  }
  constructor(entities: Entity[] = []) {
    super();
    this.initial = entities;
  }
  abstract set(entity: Entity): void;
  abstract get(_id: string): Entity | undefined;
  abstract onRun(): IterableIterator<Entity>;
  abstract [Symbol.iterator](): IterableIterator<Entity>;
  abstract delete(_id: string): void;
  abstract clear(): void;
}
