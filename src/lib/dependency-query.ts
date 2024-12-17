import { assert } from "./assume";
import { Entity } from "./ecs/entity";
import { EntityWorld } from "./ecs/entity-world";
import { Lifecycle } from "./lifecycle";

// special case of EntityQuery that expects only one entity
// meant to be used for dependency injection
export class DependencyQuery<T> extends Lifecycle<T> {
  world: EntityWorld;
  // name of the component to search for
  name: string;
  entities: Entity[] = [];

  //event unbinders
  unbinders: (() => void)[] = [];

  constructor(world: EntityWorld, name: string) {
    super();
    this.world = world;
    this.name = name;
  }
  onCreate(): void {
    // bind to events
    for (const component of [this.name]) {
      this.unbinders.push(
        this.world.emitter.on(`add-component-${component}`, entity => {
          this.entities = [entity];
        })
      );
      this.unbinders.push(
        this.world.emitter.on(`delete-component-${component}`, entity => {
          this.entities = [];
        })
      );
    }
    // add existing entities
    for (const entity of this.world.entities.values()) {
      // if the entity includes any of the components
      if (entity[this.name] !== undefined) {
        this.entities = [entity];
        break;
      }
    }
  }
  onUpdate(): void {}
  onRun(): T {
    assert(this.entities.length === 1, "DependencyQuery: expected one entity");
    return this.entities[0][this.name] as T;
  }
  onFree(): void {
    // unbind from events
    for (const unbind of this.unbinders) {
      unbind();
    }
  }
}
