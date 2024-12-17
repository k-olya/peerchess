import { Entity } from "./entity";
import { EntityDataStructure } from "./entity-data-structure";

// one entity
export class EntityOne extends EntityDataStructure {
  entities: Entity[] = [];
  // set one entity
  set(entity: Entity): void {
    this.entities = [entity];
    // force update cycle which will sort the array and remove duplicates
    this.updated = false;
  }
  // get entity
  get(id: string): Entity | undefined {
    return this.entities[0];
  }
  // delete entity
  delete(id: string): void {
    this.entities = [];
    // force update cycle which will sort the array and remove duplicates
    this.updated = false;
  }
  clear(): void {
    this.entities = [];
  }
  // do nothing on create
  onCreate() {}
  onUpdate() {}
  // iterate over entities
  onRun(): IterableIterator<Entity> {
    return this.entities.values();
  }
  [Symbol.iterator](): IterableIterator<Entity> {
    return this.run();
  }
  // clear on free
  onFree() {
    this.clear();
  }
}
