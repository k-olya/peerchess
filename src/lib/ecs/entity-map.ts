import { Entity } from "./entity";
import { EntityDataStructure } from "./entity-data-structure";

export class EntityMap extends EntityDataStructure {
  entities: Map<string, Entity> = new Map();
  set(entity: Entity): void {
    this.entities.set(entity._id, entity);
  }
  get(_id: string): Entity {
    return this.entities.get(_id);
  }
  onRun(): Iterable<Entity> {
    return this.entities.values();
  }
  delete(_id: string): void {
    this.entities.delete(_id);
  }
  clear(): void {
    this.entities.clear();
  }
  onCreate() {
    // do nothing
  }
  onUpdate() {
    // do nothing since the map is always up to date
  }
  onFree() {
    // do nothing
  }
}
