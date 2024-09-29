import { Constructor } from "./mixin";

export interface LifecycleInterface {
  onCreate(): any;
  onUpdate(): any;
  onRun(): any;
  onFree(): any;
}

export abstract class Lifecycle implements LifecycleInterface {
  // state variables
  created: boolean = false;
  updated: boolean = false;

  // lifecycle event handlers for a subclass to implement

  // create and update are called during lazy init stage
  // create is for creating resources
  // to be implemented by subclass
  abstract onCreate(): any;

  // update is for updating resources when props change
  // to be implemented by subclass
  abstract onUpdate(): any;

  // run is called during the main loop or when the instance needs to perform work
  // to be implemented by subclass
  abstract onRun(...args: any[]): any;

  // free is called during cleanup
  abstract onFree(): any;
  // to be implemented by subclass

  // lifecycle methods
  create() {
    if (this.created) return;
    const r = this.onCreate();
    this.created = true;
    return r;
  }
  update() {
    if (this.updated) return;
    this.create(); // ensure created
    const r = this.onUpdate();
    this.updated = true;
    return r;
  }
  run(...args: any[]) {
    this.update(); // ensure updated
    // console.log(this.onRun);
    return this.onRun(...args);
  }
  free() {
    if (!this.created) return;
    const r = this.onFree();
    this.created = false;
    this.updated = false;
    return r;
  }
}
