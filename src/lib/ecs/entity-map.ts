import { Entity } from "./entity-world";
import { EntityDataStructure } from "./entity-data-structure";

export class EntityMap implements EntityDataStructure {
  entities: Map<string, Entity> = new Map();
  set(entity: Entity): void {
    this.entities.set(entity._id, entity);
  }
  get(_id: string): Entity {
    return this.entities.get(_id);
  }
  run(): Iterable<Entity> {
    return this.entities.values();
  }
  delete(_id: string): void {
    this.entities.delete(_id);
  }
  clear(): void {
    this.entities.clear();
  }
  created?: boolean;
  updated?: boolean;
  create() {
    // do nothing
  }
  update() {
    // do nothing since the map is always up to date
  }
  free() {
    // do nothing
  }
}
