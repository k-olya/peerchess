import { System } from "lib/ecs/system";
import { Emitter } from "lib/emitter";

export interface InputMap {
  [key: string]: string;
}

export interface InputState {
  [key: string]: boolean;
}

export class KbMInputSystem extends Emitter(System) {
  kbDownListener?: (e: KeyboardEvent) => void;
  kbUpListener?: (e: KeyboardEvent) => void;
  mouseDownListener?: (e: MouseEvent) => void;
  mouseUpListener?: (e: MouseEvent) => void;
  contextMenuListener?: (e: MouseEvent) => void;
  state: InputState = {};
  map: InputMap = {};
  onCreate() {
    this.kbDownListener = this.onKeydown.bind(this);
    window.addEventListener("keydown", this.kbDownListener!);
    this.kbUpListener = this.onKeyup.bind(this);
    window.addEventListener("keyup", this.kbUpListener!);
    this.mouseDownListener = this.onMousedown.bind(this);
    window.addEventListener("mousedown", this.mouseDownListener!);
    this.mouseUpListener = this.onMouseup.bind(this);
    window.addEventListener("mouseup", this.mouseUpListener!);
    this.contextMenuListener = this.onContextmenu.bind(this);
    window.addEventListener("contextmenu", this.contextMenuListener!);
  }
  onKeydown(e: KeyboardEvent) {
    this.set(e.key);
  }
  onKeyup(e: KeyboardEvent) {
    this.set(e.key, false);
  }
  onMousedown(e: MouseEvent) {
    this.set(`MB${e.button}`);
  }
  onMouseup(e: MouseEvent) {
    this.set(`MB${e.button}`, false);
  }
  set(k: string, v: boolean = false) {
    const key = this.map[k];
    if (key) {
      this.state[key] = v;
      this.emit(key, v);
    }
  }
  // prevent context menu
  onContextmenu(e: MouseEvent) {
    e.preventDefault();
  }
  onUpdate() {}
  onRun(...args: any[]) {
    return this;
  }
  onFree() {
    if (this.kbDownListener) {
      window.removeEventListener("keydown", this.kbDownListener);
      this.kbDownListener = undefined;
    }
    if (this.kbUpListener) {
      window.removeEventListener("keyup", this.kbUpListener);
      this.kbUpListener = undefined;
    }
    if (this.mouseDownListener) {
      window.removeEventListener("mousedown", this.mouseDownListener);
      this.mouseDownListener = undefined;
    }
    if (this.mouseUpListener) {
      window.removeEventListener("mouseup", this.mouseUpListener);
      this.mouseUpListener = undefined;
    }
  }
}
