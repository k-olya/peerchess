import { SystemGroup } from "systems/system-group";
import { ConnectionRenderer } from "./connection-renderer";
import { AutoincrementId, randomId } from "lib/id";
import { globalWorld } from "lib/ecs/global-world";
import { EntityOne } from "lib/ecs/entity-one";
import { EntityQuery } from "lib/ecs/entity-query";
import { NetAdapter } from "systems/peer";
import { PeerClient } from "systems/peer/peer-client";
import { PeerHost } from "systems/peer/peer-host";
import { DependencyQuery } from "lib/dependency-query";
import { QueryCollection } from "lib/ecs/system";
import { getLS } from "lib/ls";

export interface ConnectionQueries extends QueryCollection {
  network: DependencyQuery<NetAdapter>;
  el: DependencyQuery<HTMLElement>;
}
export class ConnectionScene extends SystemGroup {
  constructor() {
    const queries = {
      network: new DependencyQuery<NetAdapter>(globalWorld, "network-adapter"),
      el: new DependencyQuery<HTMLElement>(globalWorld, "html-root"),
    };
    super("connection-scene", [
      new ConnectionRenderer("connection-renderer", queries),
    ]);
    this.queries = queries;
  }
  unbinder: (() => void) | undefined;
  onCreate() {
    super.onCreate();
    const id = new AutoincrementId();
    const params = new URLSearchParams(window.location.search);
    // if there is a peer to connect
    // it means we are a client
    const remotePeerId = params.get("peer");
    // get our peer id from local storage
    // or set it to random
    const ourPeerId = getLS("peerId", randomId());

    let netAdapter: NetAdapter;
    if (remotePeerId) {
      netAdapter = new PeerClient(ourPeerId, remotePeerId);
    } else {
      netAdapter = new PeerHost(ourPeerId);
    }
    // add connection callback
    this.unbinder = netAdapter.on("connection", conn => {
      const entity = globalWorld.get("global-scene-state-machine");
      if (!entity) {
        console.error("No global scene state machine found");
        return;
      }
      globalWorld.setComponent(entity, "global-scene-state-machine", "game");
    });
    // push the network system to the global world in an entity
    // for dependendecy injection
    globalWorld.set({ _id: "network-adapter", "network-adapter": netAdapter });
    // do the same for the html root
    globalWorld.set({
      _id: "html-root",
      "html-root": document.getElementById("root"),
    });
  }
  onFree() {
    // unbind events
    this.unbinder?.();
    this.queries.network.free();
    this.queries.html.free();
    super.onFree();
  }
}
