import { System } from "lib/ecs/system";
import { NetAdapter, PeerClient, PeerHost } from "./multiplayer-session";

export class NetworkSystem extends System {
  adapter: NetAdapter;
  constructor(mode: "host" | "client", peerId: string) {
    super();
    if (mode === "host") {
      this.adapter = new PeerHost(peerId);
    } else {
      this.adapter = new PeerClient(peerId);
    }
    this.adapter.onReceive(data => {
      console.log("received data", data);
    });
  }
  run() {
    if (this.adapter.role === "client") {
      this.adapter.send("keepalive");
    }
  }
}
