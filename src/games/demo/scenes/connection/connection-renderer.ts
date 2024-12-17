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

export interface ConnectionQueries extends QueryCollection {
  network: DependencyQuery<NetAdapter>;
  html: DependencyQuery<HTMLElement>;
}

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
    const html = this.queries.html.run();
    if (assume(html, "No html root found")) {
      return;
    }
    this.render(netAdapter, html);
  }
  render(adapter: NetAdapter, html: HTMLElement) {
    if (adapter.role === "host") {
      const url = window.location.origin + "/?peer=" + adapter.peerId;
      const qr = QRCode.generatePNG(url, { version: 5 });
      html.innerHTML = h`
      <div class="absolute w-full h-screen left-0 top-0 flex items-center justify-center text-white">
      <div class="flex flex-col">
        <div>You are a HOST with id ${adapter.peerId}</div>
        <img class="animate-pulse" src="${qr}">
        <div>Scan this code</div>
        <div><code class="cursor-pointer" onclick="${() =>
          copyToClipboard(
            url
          )}">${url}<img class="w-4 h-4 inline ml-1" src="./copy.svg" /></code></div>
        <div>or open this link to connect</div>
      </div>
      </div>`;
    } else {
      html.innerHTML = `You are a CLIENT connecting to a host`;
    }
  }
}
