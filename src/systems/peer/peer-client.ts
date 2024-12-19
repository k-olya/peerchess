import { EmitterObject } from "lib/emitter";
import { randomId } from "lib/id";
import Peer, { DataConnection } from "peerjs";
import { NetAdapter, PEER_CONFIG } from ".";

export class PeerClient extends EmitterObject implements NetAdapter {
  private connection: DataConnection | null = null;
  peers: string[];
  peerId: string;
  role: "client" = "client";

  constructor(ourPeerId: string, remotePeerId: string) {
    super();
    const peer = new Peer(ourPeerId, PEER_CONFIG);
    this.peers = [remotePeerId];
    this.peerId = ourPeerId;
    peer.on("open", () => {
      this.connect(peer, remotePeerId);
    });
  }

  connect(peer: Peer, peerId: string) {
    const conn = peer.connect(peerId);
    conn.on("open", () => {
      this.connection = conn;
      this.emit("connection", conn);
      conn.on("data", data => this.emit("data", data));
    });
    // Handle errors
    conn.on("error", err => console.error("Connection error:", err));
  }

  send(data: any) {
    if (this.connection) {
      console.log("sending data", data);
      this.connection.send(data);
    }
  }
}
