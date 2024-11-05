import { loopSystem, RenderLoop } from "lib/game-loop";
import { SystemGroup } from "systems/system-group";
import { AutoincrementId, dateNowId, randomId } from "lib/id";
import { System } from "lib/ecs/system";
import { fixedCall } from "lib/fix-call";
import { KbMInputSystem } from "systems/input";
import { NetAdapter, PeerClient, PeerHost } from "systems/multiplayer-session";
import { NetworkSystem } from "systems/network";

export const SIMULATION_FPS = 60;

export class SimulationSystem extends System {
  _id: string = "simulation";
  simulationFrame: number = 0;
  fixedRun = fixedCall(this._fixedRun.bind(this), 1000 / SIMULATION_FPS);
  onCreate() {}
  onUpdate() {}
  onFree() {}
  _fixedRun(rl: RenderLoop) {
    console.log("fixed simulation", this.simulationFrame, rl.time);
    this.simulationFrame++;
  }
  onRun(rl: RenderLoop) {
    this.fixedRun(rl);
  }
}

// how to bootstrap a game
export function game() {
  const id = new AutoincrementId();
  const params = new URLSearchParams(window.location.search);
  const peerId = params.get("peer");

  const netSystem = new NetworkSystem(
    peerId ? "client" : "host",
    peerId ?? randomId()
  );

  console.log(netSystem.adapter.role, netSystem.adapter.peerId);

  // Accessing specific parameters
  const page = params.get("page"); // '2'
  const sort = params.get("sort"); // 'desc'

  const masterSystem = new SystemGroup("game", [
    // add systems here
    new SystemGroup("000-input-group", [new KbMInputSystem()]),
    new SystemGroup("001-network-group", [netSystem]),
    new SystemGroup("002-simulation-group", []),
    new SystemGroup("004-interaction-group", []),
    new SystemGroup("005-render-group", []),
  ]);
  const renderLoop = loopSystem(RenderLoop, masterSystem);
  masterSystem.print();
}
