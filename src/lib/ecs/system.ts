import { EntityQuery } from "./entity-query";
import { Lifecycle } from "../lifecycle";
import { Collection } from "lib/collection";

export type QueryCollection = Collection<EntityQuery<any>>;
export type SystemOptions = {
  queries?: QueryCollection;
};

export class System extends Lifecycle {
  queries: QueryCollection;
  constructor(options?: SystemOptions) {
    super();
    this.queries = options.queries || {};
  }
  onCreate() {
    for (const key in this.queries) {
      this.queries[key].create();
    }
  }
  onUpdate() {
    for (const key in this.queries) {
      this.queries[key].update();
    }
  }
  onRun() {
    // do nothing
  }
  onFree() {
    for (const key in this.queries) {
      this.queries[key].free();
    }
  }
}
