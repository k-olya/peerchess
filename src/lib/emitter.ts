import { createNanoEvents } from "nanoevents";
import { Constructor } from "./mixin";
import { Collection } from "./collection";
import { debugMode } from "./debug";

export type EventCallback = (...args: any[]) => void;
export type Events = Collection<EventCallback>;
export interface EmitterInterface {
  on(event: string, callback: EventCallback): void;
  emit(event: string, ...args: any[]): void;
}

// event emitter mixin
export function Emitter<T extends Constructor>(Base: T) {
  return class extends Base implements EmitterInterface {
    emitter = createNanoEvents();
    constructor(...args: any[]) {
      super(...args);
    }
    on(event: string, callback: EventCallback) {
      // warn the user if debug mode is on and the event doesn't exist
      if (debugMode && !(event in this.emitter.events))
        console.warn(`Trying to trigger a non-existent event "${event}"`);
      return this.emitter.on(event, callback);
    }
    emit(event: string, ...args: any[]) {
      return this.emitter.emit(event, ...args);
    }
  };
}

// base Emitter class
export class EmitterObject extends Emitter(class {}) {}
