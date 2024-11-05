// miscellaneous mathematical functions

// shuffle array
export function shuffle<T>(a: T[]): T[] {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

// linear interpolation
export function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

// clamp value
export function clamp(x: number, min = 0.0, max = 1.0) {
  return Math.min(max, Math.max(min, x));
}
// extract fractional part glsl-style
export function fract(x: number) {
  return x - floor(x);
}

// get random integer in the range [0, x)
export function irand(x: number) {
  return floor(Math.random() * x);
}
// get random number in the range [a, b)
export function rand(a: number, b: number) {
  return lerp(a, b, Math.random());
}
// create a range: [0, 1, 2, ..., x]
export function range(x: number) {
  return Array.from(Array(x).keys());
}

// misc
export const floor = Math.floor;
export const ceil = Math.ceil;
export const abs = Math.abs;
export const min = Math.min;
export const max = Math.max;
export const PI = Math.PI;
export const sin = Math.sin;
export const cos = Math.cos;
export const tan = Math.tan;
export const sqrt = Math.sqrt;
export const pow = Math.pow;
export const exp = Math.exp;
export const log = Math.log;
export const atan2 = Math.atan2;
