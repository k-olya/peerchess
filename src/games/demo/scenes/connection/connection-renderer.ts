import { EntityOne } from "lib/ecs/entity-one";
import { EntityQuery } from "lib/ecs/entity-query";
import { globalWorld } from "lib/ecs/global-world";
import { QueryCollection, System } from "lib/ecs/system";
import { DataConnection } from "peerjs";
import * as QRCode from "lib/qr";
import { NetAdapter } from "systems/peer";
import { assume } from "lib/assume";
import { DependencyQuery } from "lib/dependency-query";
import { h } from "lib/html";
import { html, render } from "uhtml";
import { ConnectionQueries } from ".";

function copyToClipboard(url: string): void {
  if (!window.navigator.clipboard) {
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    alert("Url copied to clipboard");
  } else {
    window.navigator.clipboard
      .writeText(url)
      .then(() => alert("Url copied to clipboard"));
  }
}

export class ConnectionRenderer extends System<ConnectionQueries> {
  onCreate() {
    super.onCreate();
    const netAdapter = this.queries.network.run();
    if (assume(netAdapter, "No network system found")) {
      return;
    }
    const el = this.queries.el.run();
    if (assume(el, "No html root found")) {
      return;
    }
    this.render(netAdapter, el);
  }
  render(adapter: NetAdapter, el: HTMLElement) {
    if (adapter.role === "host") {
      const url = window.location.origin + "/?peer=" + adapter.peerId;
      const qr = QRCode.generatePNG(url, { version: 5 });
      render(
        el,
        html` <div
          class="absolute w-full h-screen left-0 top-0 flex items-center justify-center text-white"
        >
          <div class="flex flex-col">
            <div>You are a HOST with id ${adapter.peerId}</div>
            <img class="animate-pulse" src="${qr}" />
            <div>Scan this code</div>
            <div>
              <code
                class="cursor-pointer"
                onclick="${() => copyToClipboard(url)}"
                >${url}<img class="w-4 h-4 inline ml-1" src="./copy.svg"
              /></code>
            </div>
            <div>or open this link to connect</div>
          </div>
        </div>`
      );
    } else {
      render(
        el,
        html`You are CLIENT ${adapter.peerId} connecting to host
        ${adapter.peers?.[0] ?? ""}`
      );
    }
  }
}
