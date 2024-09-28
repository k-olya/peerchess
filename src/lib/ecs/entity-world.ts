import { createNanoEvents } from "nanoevents";
import { Entity, forEachComponent } from "./entity";
import { EmitterObject } from "lib/emitter";
import { debugMode } from "lib/debug";

export interface EntityWorldEvents {
  "add-entity": (entity: Entity) => void;
  "delete-entity": (entity: Entity) => void;
  "update-entity": (entity: Entity) => void;
  "add-component-*": (entity: Entity, value: any) => void;
  "update-component-*": (entity: Entity, value: any) => void;
  "delete-component-*": (entity: Entity) => void;
}

// EntityWorld is a class that manages entities
// and emits events when entities are modified
export class EntityWorld extends EmitterObject {
  entities: Map<string, Entity>;
  emitter = createNanoEvents();
  constructor(entities?: Entity[]) {
    super();
    this.entities = new Map();
    entities.forEach(entity => this.entities.set(entity._id, entity));
  }
  set(entity: Entity) {
    const prev = this.entities.get(entity._id);
    if (prev) {
      // if debug mode is on, warn about overwriting entities
      if (debugMode) {
        console.warn(`Overwriting entity with id "${entity._id}"`);
      }
      // don't throw an error, update the components instead
      this.setComponents(prev, entity);
    } else {
      this.entities.set(entity._id, entity);
      forEachComponent(entity, (key, value) => {
        this.emit("add-component-" + key, entity, value);
      });
      this.emitter.emit("add-entity", entity);
    }
  }
  // set multiple components and trigger entity events
  setComponents(entity: Entity, components: Record<string, any>) {
    forEachComponent(entity, (key, value) => {
      this._setComponent(entity, key, components[key]);
    });
    this.emitter.emit("update-entity", entity);
  }
  // set one component and trigger entity events
  setComponent(entity: Entity, key: string, value: any) {
    this._setComponent(entity, key, value);
    this.emit("update-entity", entity);
  }
  // set one component without triggering entity event
  _setComponent(entity: Entity, key: string, value: any) {
    const prevHas = typeof entity[key] !== "undefined";
    const nextHas = typeof value !== "undefined";
    if (prevHas && nextHas && value !== value) {
      entity[key] = value;
      this.emit("update-component-" + key, entity, value);
    } else if (prevHas && !nextHas) {
      delete entity[key];
      this.emit("delete-component-" + key, entity);
    } else if (!prevHas && entity[key]) {
      entity[key] = value;
      this.emit("add-component-" + key, entity, value);
    }
  }
  addComponent(entity: Entity, key: string, value: any) {
    // if (typeof entity[key] !== "undefined") {
    // throw new Error(`Component "${key}" already exists in entity`);
    // }

    entity[key] = value;
    this.emit("add-component-" + key, entity, value);
    this.emit("update-entity", entity);
  }
  updateComponent(entity: Entity, key: string, value: any) {
    // if (typeof entity[key] === "undefined") {
    // throw new Error(`Component "${key}" does not exist in entity`);
    // }
    entity[key] = value;
    this.emit("update-component-" + key, entity, value);
    this.emit("update-entity", entity);
  }
  deleteComponent(entity: Entity, key: string) {
    // if (typeof entity[key] === "undefined") {
    // throw new Error(`Component "${key}" does not exist in entity`);
    // }
    delete entity[key];
    this.emit("delete-component-" + key, entity);
    this.emit("update-entity, entity");
  }
  get(id: string) {
    return this.entities.get(id);
  }
  deleteEntity(id: string) {
    const entity = this.entities.get(id);
    if (entity) {
      forEachComponent(entity, (key, value) => {
        this.emit("delete-component-" + key, entity);
      });
      this.entities.delete(id);
      this.emit("delete-entity", entity);
    }
  }
}
