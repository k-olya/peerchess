import { QueryCollection, System } from "lib/ecs/system";
import { InputState } from "../input";
import Peer, { DataConnection } from "peerjs";
import { EmitterObject } from "lib/emitter";
import { Emitter } from "nanoevents";
import { randomId } from "lib/id";
import { NetAdapter, PEER_CONFIG } from ".";

export class PeerHost extends EmitterObject implements NetAdapter {
  private peer: Peer;
  private connections: DataConnection[] = [];
  role: "host" = "host";
  peers: string[];
  peerId: string;

  constructor(peerId: string) {
    super();
    this.peer = new Peer(peerId, PEER_CONFIG);
    this.peerId = peerId;
    this.peers = [];
    this.peer.on("connection", conn => {
      this.connections.push(conn);
      this.peers.push(conn.peer);
      this.emit("connection", conn);
      conn.on("data", data => this.emit("data", data));
    });
  }

  send(data: any) {
    this.connections.forEach(conn => conn.send(data));
  }
}
