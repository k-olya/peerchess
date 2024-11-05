import { min, floor } from "./math";

export function fixedCall(fn: Function, delay: number, maxFrames: number = 3) {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = performance.now();
    const delta = now - lastCall;
    if (delta < delay) {
      return;
    }
    lastCall = now;
    // call the function multiple times if the delta is too large
    // but at most maxFrames times
    const frames = min(floor(delta / delay), maxFrames);
    for (let i = 0; i < frames; i++) fn(...args);
  };
}
