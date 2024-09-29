import { Entity } from "./entity";
import { EntityDataStructure } from "./entity-data-structure";

// sorted array of entities
// TODO: test and decide which removal method to keep: markForRemoval or delete
export class EntitySortedArray extends EntityDataStructure {
  entities: Entity[] = [];
  markedForRemoval?: boolean[];
  // binary search
  // if not found, return the index where it should be inserted
  binSearch(_id: string): number {
    let left = 0;
    let right = this.entities.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (this.entities[mid]._id === _id) return mid;
      if (this.entities[mid]._id < _id) left = mid + 1;
      else right = mid - 1;
    }
    return left;
  }
  // mark entity index for removal
  markForRemoval(_id: string) {
    const spot = this.binSearch(_id);
    if (this.entities[spot]._id !== _id) return;
    if (!this.markedForRemoval)
      this.markedForRemoval = new Array(this.entities.length).fill(false);
    this.markedForRemoval[spot] = true;
    this.updated = false;
  }
  // remove marked entities
  removeMarked() {
    if (!this.markedForRemoval) return;
    this.entities = this.entities.filter(
      (_, index) => !this.markedForRemoval![index],
      this
    );
    this.markedForRemoval = undefined;
  }
  // remove duplicate entities
  // must be called on a sorted array
  unique() {
    this.entities = this.entities.filter(
      (entity, index) =>
        index === 0 || entity?._id !== this.entities[index - 1]?._id
    );
  }
  // set one entity
  set(entity: Entity): void {
    this.entities.push(entity);
    // update marked for removal
    if (this.markedForRemoval) {
      this.markedForRemoval.push(false);
    }
    // force update cycle which will sort the array and remove duplicates
    this.updated = false;
  }
  // get entity by id
  get(_id: string): Entity | undefined {
    const spot = this.binSearch(_id);
    if (this.entities[spot]._id !== _id) return undefined;
    if (this.markedForRemoval?.[spot]) return undefined;
    return this.entities[spot];
  }
  // delete entity by id
  delete(_id: string): void {
    this.markForRemoval(_id);
    const spot = this.binSearch(_id);
    if (this.entities[spot]._id !== _id) return;
    // force update cycle which will sort the array and remove duplicates
    this.updated = false;
  }
  // clear the array
  clear(): void {
    this.entities = [];
    this.markedForRemoval = undefined;
  }
  // do nothing on create
  onCreate() {}
  // make the array null-free, sorted and unique
  onUpdate() {
    this.removeMarked();
    this.entities.sort((a, b) => a._id.localeCompare(b._id));
    this.unique();
  }
  // iterate over entities
  onRun(): IterableIterator<Entity> {
    // {
    /*for (const entity of this.entities) {
      if (entity !== null) {
        yield entity;
      }
    }*/
    // }
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
