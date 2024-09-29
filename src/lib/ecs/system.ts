import { EntityQuery } from "./entity-query";
import { Lifecycle } from "../lifecycle";
import { Collection } from "lib/collection";

export type QueryCollection = Collection<EntityQuery<any>>;
export type SystemOptions = {
  queries?: QueryCollection;
};

export abstract class System extends Lifecycle {
  abstract _id: string; // systems added to the same game loop will be ordered by ids
  queries: QueryCollection;
  constructor(options?: SystemOptions) {
    super();
    this.queries = options?.queries || {};
  }
  // override free instead of implementing onFree to keep onFree abstract
  free() {
    for (const key in this.queries) {
      this.queries[key].free();
    }
    super.free();
  }
}
