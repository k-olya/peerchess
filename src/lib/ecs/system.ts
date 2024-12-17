import { EntityQuery } from "./entity-query";
import { Lifecycle } from "../lifecycle";
import { Collection } from "lib/collection";
import { randomId } from "lib/id";
import { DependencyQuery } from "lib/dependency-query";
import { debugMode } from "lib/debug";

export type QueryCollection = Collection<
  EntityQuery<any> | DependencyQuery<any>
>;

export class System<
  T extends QueryCollection = any,
  T2 extends QueryCollection = {}
> extends Lifecycle<void> {
  _id: string; // systems added to the same game loop will be ordered by ids
  queries: T;
  managedQueries: T2 = {} as T2;
  constructor(_id: string, sharedQueries: T) {
    super();
    this.queries = sharedQueries;
    this._id = _id || `<unnamed system ${randomId()}>`;
  }
  // override free instead of implementing onFree to keep onFree abstract
  free() {
    for (const key in this.managedQueries) {
      if (this.managedQueries[key]?.created) {
        this.managedQueries[key].free();
      }
    }
  }
}

export class BasicSystem extends System<{}> {
  constructor(_id: string) {
    super(_id, {});
  }
}
