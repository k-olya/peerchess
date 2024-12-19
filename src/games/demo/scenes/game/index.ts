import { EntityOne } from "lib/ecs/entity-one";
import { EntityQuery } from "lib/ecs/entity-query";
import { globalWorld } from "lib/ecs/global-world";
import { QueryCollection, System } from "lib/ecs/system";
import { SystemGroup } from "systems/system-group";
import { GameRenderer } from "./game-renderer";
import { NetAdapter } from "systems/peer";
import { assume } from "lib/assume";
import { DependencyQuery } from "lib/dependency-query";

export interface GameQueries extends QueryCollection {
  network: DependencyQuery<NetAdapter>;
  el: DependencyQuery<HTMLElement>;
}

export class GameScene extends SystemGroup {
  queries: GameQueries;
  constructor() {
    const network = new DependencyQuery<NetAdapter>(
      globalWorld,
      "network-adapter"
    );
    const el = new DependencyQuery<HTMLElement>(globalWorld, "html-root");
    super("game", [
      new GameRenderer("005-game-renderer", {
        network,
        el,
      }),
    ]);
    this.queries = {
      network,
      el,
    };
  }
  onCreate() {
    super.onCreate();
    const network = this.queries.network.run();
    if (assume(network, "No network system found")) {
      return;
    }
  }
  onFree() {
    this.queries.network.free();
    this.queries.el.free();
  }
}
