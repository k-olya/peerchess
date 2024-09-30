import { loopSystem, RenderLoop } from "lib/game-loop";
import { SystemGroup } from "systems/system-group";
import { dateNowId, randomId } from "lib/id";

// how to bootstrap a game
export function game() {
  const masterSystem = new SystemGroup("game", [
    // add systems here
    new SystemGroup("000-input-group", []),
    new SystemGroup("001-simulation-group", []),
    new SystemGroup("002-interaction-group", []),
    new SystemGroup("003-render-group", []),
  ]);
  const renderLoop = loopSystem(RenderLoop, masterSystem);
  masterSystem.print();
  console.log(randomId());
  console.log(dateNowId());
}
