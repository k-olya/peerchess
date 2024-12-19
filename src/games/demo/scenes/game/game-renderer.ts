import { EntityOne } from "lib/ecs/entity-one";
import { EntityQuery } from "lib/ecs/entity-query";
import { globalWorld } from "lib/ecs/global-world";
import { QueryCollection, System } from "lib/ecs/system";
import { DataConnection } from "peerjs";
import * as QRCode from "lib/qr";
import { NetAdapter } from "systems/peer";
import { GameQueries } from ".";
import { html, render } from "uhtml";

const INITIAL_PIECES = [
  { x: 0, y: 1, type: "pawn", color: "white" },
  { x: 1, y: 1, type: "pawn", color: "white" },
  { x: 2, y: 1, type: "pawn", color: "white" },
  { x: 3, y: 1, type: "pawn", color: "white" },
  { x: 4, y: 1, type: "pawn", color: "white" },
  { x: 5, y: 1, type: "pawn", color: "white" },
  { x: 6, y: 1, type: "pawn", color: "white" },
  { x: 7, y: 1, type: "pawn", color: "white" },
  { x: 0, y: 0, type: "rook", color: "white" },
  { x: 1, y: 0, type: "knight", color: "white" },
  { x: 2, y: 0, type: "bishop", color: "white" },
  { x: 3, y: 0, type: "queen", color: "white" },
  { x: 4, y: 0, type: "king", color: "white" },
  { x: 5, y: 0, type: "bishop", color: "white" },
  { x: 6, y: 0, type: "knight", color: "white" },
  { x: 7, y: 0, type: "rook", color: "white" },
  { x: 0, y: 6, type: "pawn", color: "black" },
  { x: 1, y: 6, type: "pawn", color: "black" },
  { x: 2, y: 6, type: "pawn", color: "black" },
  { x: 3, y: 6, type: "pawn", color: "black" },
  { x: 4, y: 6, type: "pawn", color: "black" },
  { x: 5, y: 6, type: "pawn", color: "black" },
  { x: 6, y: 6, type: "pawn", color: "black" },
  { x: 7, y: 6, type: "pawn", color: "black" },
  { x: 0, y: 7, type: "rook", color: "black" },
  { x: 1, y: 7, type: "knight", color: "black" },
  { x: 2, y: 7, type: "bishop", color: "black" },
  { x: 3, y: 7, type: "queen", color: "black" },
  { x: 4, y: 7, type: "king", color: "black" },
  { x: 5, y: 7, type: "bishop", color: "black" },
  { x: 6, y: 7, type: "knight", color: "black" },
  { x: 7, y: 7, type: "rook", color: "black" },
];

export class GameRenderer extends System<GameQueries> {
  onCreate() {
    super.onCreate();
    const network = this.queries.network.run();
    if (!network) {
      console.error("No network system found");
      return;
    }
    const el = this.queries.el.run();
    if (!el) {
      console.error("No html root found");
      return;
    }
    this.render(network, el);
  }
  render(adapter: NetAdapter, el: HTMLElement) {
    render(
      el,
      html` <div
        class="absolute w-full h-screen left-0 top-0 flex items-center justify-center text-white"
      >
        <div class="flex flex-col w-screen items-center">
          <div>
            You are a ${adapter.role.toLocaleUpperCase()} ${adapter.peerId}
            connected to ${adapter.peers.join(", ")}
          </div>
          <div class="relative w-[80vmin] h-[80vmin]">
            <img src="/field.webp" />
            ${INITIAL_PIECES.map(
              piece =>
                html`<img
                  class="absolute w-[10vmin] h-[10vmin]"
                  src=${`./${piece.color.charAt(0)}${piece.type}.png`}
                  style=${`top: ${10 * piece.y}vmin; left: ${
                    10 * piece.x
                  }vmin;`}
                /> `
            )}
          </div>
        </div>
      </div>`
    );
  }
}
{
  /*}`
<img
                  class="absolute w-[10vmin] h-[10vmin]"
                  src="${`./${piece.color.charAt(0)}${piece.type}.png`}"
                  style="top:
                ${10 * piece.y}vmin; left: ${10 * piece.x}vmin;"
                  )
                />
`*/
}
