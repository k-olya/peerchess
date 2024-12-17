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

export class ConnectionScene extends SystemGroup {
  constructor() {
    super("connection-scene", [
      new ConnectionRenderer("connection-renderer", {
        network: new DependencyQuery(globalWorld, "network-adapter"),
        html: new DependencyQuery(globalWorld, "html-root"),
      }),
    ]);
  }
  unbinder: (() => void) | undefined;
  onCreate() {
    super.onCreate();
    const id = new AutoincrementId();
    const params = new URLSearchParams(window.location.search);
    // if there is a peer to connect
    // it means we are a client
    const netMode = params.get("peer") ? "client" : "host";
    const peerId = params.get("peer") ?? randomId();

    let netAdapter: NetAdapter;
    if (netMode === "client") {
      netAdapter = new PeerClient(peerId);
    } else {
      netAdapter = new PeerHost(peerId);
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
    super.onFree();
  }
}
