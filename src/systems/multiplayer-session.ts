import { QueryCollection, System } from "lib/ecs/system";
import { InputState } from "./input";
import Peer, { DataConnection } from "peerjs";

export type PlayerRole = "host" | "client";

export interface Player {
  networkId: string;
  name: string;
  role: PlayerRole;
  inputs: InputState;
}

const config = {
  debug: 3,
  host: process.env.PEER_HOST!,
  port: Number(process.env.PEER_PORT!),
  path: process.env.PEER_PATH!,
  secure: true,
  config: {
    iceServers: [
      { urls: process.env.STUN_URL! },
      {
        urls: process.env.TURN_URL!,
        username: process.env.TURN_USERNAME!,
        credential: process.env.TURN_CREDENTIAL!,
      },
    ],
  },
};

export interface NetAdapter {
  send(data: any): void;
  onReceive(callback: (data: any) => void): void;
  role: "host" | "client";
  peerId: string;
}

export class PeerHost implements NetAdapter {
  private peer: Peer;
  private connections: DataConnection[] = [];
  role: "host" = "host";
  peerId: string;
  receiveData = (data: any) => {};

  constructor(peerId: string) {
    this.peer = new Peer(peerId, config);
    this.peerId = peerId;
    this.peer.on("connection", conn => {
      this.connections.push(conn);
      conn.on("data", data => this.receiveData(data));
    });
  }

  send(data: any) {
    this.connections.forEach(conn => conn.send(data));
  }

  onReceive(callback: (data: any) => void) {
    this.receiveData = callback;
  }
}

export class PeerClient implements NetAdapter {
  private connection: DataConnection | null = null;
  peerId: string;
  role: "client" = "client";
  receiveData = (data: any) => {};

  constructor(peerId: string) {
    const peer = new Peer(config);
    this.peerId = peerId;
    peer.on("open", () => this.connect(peer, peerId));
  }

  connect(peer: Peer, peerId: string) {
    const conn = peer.connect(peerId);
    conn.on("open", () => {
      this.connection = conn;
      conn.on("data", data => this.receiveData(data));
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

  onReceive(callback: (data: any) => void) {
    this.receiveData = callback;
  }
}
