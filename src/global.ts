// global objects accessible from anywhere in the app

import { EntityWorld } from "lib/ecs/entity-world";
import { AutoincrementId } from "lib/id";

export const GLOBAL = {
  world: new EntityWorld(),
  autoincrement: new AutoincrementId(),
};
