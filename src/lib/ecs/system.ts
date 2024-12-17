import { EntityQuery } from "./entity-query";
import { Lifecycle } from "../lifecycle";
import { Collection } from "lib/collection";
import { randomId } from "lib/id";
import { DependencyQuery } from "lib/dependency-query";

export type QueryCollection = Collection<
  EntityQuery<any> | DependencyQuery<any>
>;
export type SystemOptions = {
  queries?: QueryCollection;
  _id?: string;
};

export class SystemWithQueries<
  T extends QueryCollection
> extends Lifecycle<void> {
  _id: string; // systems added to the same game loop will be ordered by ids
  queries: T;
  constructor(_id: string, queries: T) {
    super();
    this.queries = queries;
    this._id = _id || `<unnamed system ${randomId()}>`;
  }
  // override free instead of implementing onFree to keep onFree abstract
  free() {
    for (const key in this.queries) {
      if (this.queries[key]?.created) {
        this.queries[key].free();
      }
    }
    super.free();
  }
}

export type System = SystemWithQueries<any>;

export class BasicSystem extends SystemWithQueries<{}> {
  constructor(_id: string) {
    super(_id, {});
  }
}
