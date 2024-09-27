import { EntityDataStructure } from "./entity-data-structure";
import { EntityWorld } from "./entity-world";
import { Entity } from "./entity";
import { create, free, Lifecycle, run, update } from "../lifecycle";

export type EntityQueryOptions =
  | {
      include: string[];
      exclude?: string[];
      filter?: (entity: Entity) => boolean;
    }
  | string[];

export class EntityQuery<T extends EntityDataStructure> implements Lifecycle {
  // lifecycle fields
  created?: boolean;
  updated?: boolean;
  // components to include
  include: string[];
  // components must pass a filter function
  filter?: (entity: Entity) => boolean;
  // world to operate on
  world: EntityWorld;
  // entities that match the query
  entities: T;

  //event unbinders
  unbinders: (() => void)[] = [];

  constructor(
    dataStructure: new () => T, // data structure to use
    world: EntityWorld,
    include: string[],
    filter?: (entity: Entity) => boolean
  ) {
    this.include = include;
    this.filter = filter;
    this.world = world;
    this.entities = new dataStructure();
  }
  create(): void {
    // create data structure
    create(this.entities);
    // bind to events
    for (const component of this.include) {
      this.unbinders.push(
        this.world.emitter.on(`add-component-${component}`, entity => {
          if (this.filter && !this.filter(entity)) return;
          this.entities.set(entity);
        })
      );
      this.unbinders.push(
        this.world.emitter.on(`delete-component-${component}`, entity => {
          this.entities.delete(entity._id);
        })
      );
    }
    // add existing entities
    for (const entity of this.world.entities.values()) {
      if (this.filter && !this.filter(entity)) continue;
      this.entities.set(entity);
    }
  }
  update(): void {
    // update entities
    update(this.entities);
  }
  // iterate over entities
  run(): Iterable<Entity> {
    return run(this.entities);
  }
  free(): void {
    // unbind from events
    for (const unbind of this.unbinders) {
      unbind();
    }
    // free entities
    free(this.entities);
  }
}
