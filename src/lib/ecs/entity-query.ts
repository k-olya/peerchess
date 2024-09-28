import { EntityDataStructure } from "./entity-data-structure";
import { EntityWorld } from "./entity-world";
import { Entity } from "./entity";
import { Lifecycle } from "../lifecycle";

export type EntityQueryOptions =
  | {
      include: string[];
      exclude?: string[];
      filter?: (entity: Entity) => boolean;
    }
  | string[];

export class EntityQuery<T extends EntityDataStructure> extends Lifecycle {
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
    super();
    this.include = include;
    this.filter = filter;
    this.world = world;
    this.entities = new dataStructure();
  }
  onCreate(): void {
    // create data structure
    this.entities.create();
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
  onUpdate(): void {
    // update entities
    this.entities.update();
  }
  // iterate over entities
  onRun(): Iterable<Entity> {
    return this.entities.run();
  }
  onFree(): void {
    // unbind from events
    for (const unbind of this.unbinders) {
      unbind();
    }
    // free entities
    this.entities.free();
  }
}
