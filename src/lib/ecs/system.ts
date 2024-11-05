import { EntityQuery } from "./entity-query";
import { Lifecycle } from "../lifecycle";
import { Collection } from "lib/collection";

export type QueryCollection = Collection<EntityQuery<any>>;
export type SystemOptions = {
  queries?: QueryCollection;
  id?: string;
};

export class System extends Lifecycle {
  _id: string; // systems added to the same game loop will be ordered by ids
  queries: QueryCollection;
  constructor(options?: SystemOptions) {
    super();
    this.queries = options?.queries || {};
    this._id = options?.id || "<unnamed system>";
  }
  // override free instead of implementing onFree to keep onFree abstract
  free() {
    for (const key in this.queries) {
      this.queries[key].free();
    }
    super.free();
  }
}
