import { EntityQuery } from "./entity-query";
import { create, free, Lifecycle, update } from "../lifecycle";
import { Collection } from "lib/collection";

export type QueryCollection = Collection<EntityQuery<any>>;
export type SystemOptions = {
  queries?: QueryCollection;
};

export class System implements Lifecycle {
  created?: boolean;
  updated?: boolean;
  queries: QueryCollection;
  constructor(options?: SystemOptions) {
    this.queries = options.queries || {};
  }
  create() {
    for (const key in this.queries) {
      create(this.queries[key]);
    }
  }
  update() {
    for (const key in this.queries) {
      update(this.queries[key]);
    }
  }
  run() {
    // do nothing
  }
  free() {
    for (const key in this.queries) {
      free(this.queries[key]);
    }
  }
}
