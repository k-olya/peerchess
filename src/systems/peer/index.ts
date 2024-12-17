import { EmitterObject } from "lib/emitter";
import { InputState } from "systems/input";

export type PlayerRole = "host" | "client";

export interface Player {
  peerId: string;
  name: string;
  role: PlayerRole;
  inputs: InputState;
}

export const PEER_CONFIG = {
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

export interface NetAdapter extends EmitterObject {
  send(data: any): void;
  role: "host" | "client";
  peers: string[];
  peerId: string;
}
