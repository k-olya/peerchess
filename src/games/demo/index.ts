import { loopSystem, RenderLoop } from "lib/game-loop";
import { SystemGroup } from "systems/system-group";
import { AutoincrementId, dateNowId, randomId } from "lib/id";
import { System } from "lib/ecs/system";
import { fixedCall } from "lib/fix-call";
import { KbMInputSystem } from "systems/input";
import { ConnectionRenderer } from "./scenes/connection/connection-renderer";
import { globalWorld } from "lib/ecs/global-world";
import { Collection } from "lib/collection";
import { SceneStateMachine } from "systems/scene-state-machine";
import { ConnectionScene } from "./scenes/connection";
import { GameScene } from "./scenes/game";
import { RenderLoopSystem } from "systems/render-loop";

// how to bootstrap a game
export function game() {
  return new RenderLoopSystem("main-render-loop", [
    new SystemGroup("000-global-state-machine", [
      new SceneStateMachine("global-scene-state-machine", {
        initial: () => new ConnectionScene(),
        game: () => new GameScene(),
      }),
    ]),
  ]);
}
