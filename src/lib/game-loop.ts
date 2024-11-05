import { System } from "./ecs/system";
import { EmitterInterface, EmitterObject } from "./emitter";
import { Lifecycle } from "./lifecycle";

export interface GameLoop extends EmitterInterface {
  time: number;
  delta: number;
  frame: number;
  start(): void;
  pause(): void;
}

export interface GameLoopEvents {
  start: (loop: GameLoop) => void;
  loop: (loop: GameLoop) => void;
  pause: (loop: GameLoop) => void;
}

// a game loop bound to requestAnimationFrame
export class RenderLoop extends EmitterObject implements GameLoop {
  time: number = 0;
  delta: number = 0;
  frame: number = 0;
  start() {
    this.time = performance.now();
    this.emit("start", this);
    this.loop(this.time);
  }
  private raf: number | null = null;
  private boundLoop: FrameRequestCallback = this.loop.bind(this);
  private loop(time: number) {
    this.raf = window.requestAnimationFrame(this.boundLoop);
    this.delta = time - this.time;
    this.time = time;
    this.emit("loop", this);
    this.frame++;
  }
  pause() {
    if (this.raf !== null) {
      window.cancelAnimationFrame(this.raf);
    }
    this.emit("pause", this);
  }
}

// a game loop bound to setTimeout
export class TimeoutLoop extends EmitterObject implements GameLoop {
  time: number = 0;
  delta: number = 0;
  frame: number = 0;
  start() {
    this.time = performance.now();
    this.emit("start", this);
    this.loop();
  }
  private timeout: number | null = null;
  private boundLoop = this.loop.bind(this);
  private loop() {
    const time = performance.now();
    this.delta = time - this.time;
    this.time = time;
    this.emit("loop", this);
    this.frame++;
    this.timeout = window.setTimeout(this.boundLoop, 0);
  }
  pause() {
    if (this.timeout !== null) {
      window.clearTimeout(this.timeout);
    }
    this.emit("pause", this);
  }
}

export function loopSystem<T extends GameLoop>(
  loopConstructor: new () => T,
  system: System
) {
  const loop = new loopConstructor();
  loop.on("loop", rl => {
    system.run(rl);
  });
  loop.start();
  return loop;
}
