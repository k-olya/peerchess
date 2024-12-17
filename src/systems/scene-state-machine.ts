import { Collection } from "lib/collection";
import { globalWorld } from "lib/ecs/global-world";
import { System } from "lib/ecs/system";
import { SystemGroup } from "./system-group";
import { EntitySortedArray } from "lib/ecs/entity-sorted-array";

export type SystemInitializerCollection = Collection<() => System>;

// a state machine system that switches between scenes
export class SceneStateMachine extends SystemGroup {
  scenes: SystemInitializerCollection;
  initialState: string;
  constructor(
    id: string,
    scenes: SystemInitializerCollection,
    initialState: string = "initial"
  ) {
    super(id, [scenes[initialState]()]);
    this.scenes = scenes;
    this.initialState = initialState;
  }
  unbinder: (() => void) | undefined;
  onCreate(): void {
    globalWorld.set({ _id: this._id, [this._id]: this.initialState });
    this.unbinder = globalWorld.on(
      "update-component-" + this._id,
      (entity, state) => {
        console.warn("Switching to state", state);
        for (const scene of this.children) {
          scene.free();
        }
        this.children.free();
        this.children = new EntitySortedArray([this.scenes[state]()]);
        this.print();
      }
    );
  }
  onFree(): void {
    this.unbinder?.();
    globalWorld.deleteEntity(this._id);
    super.onFree();
  }
}
