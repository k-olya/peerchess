export interface Lifecycle {
  created?: boolean;
  updated?: boolean;
  // create and update are called during lazy init stage
  // create is for creating resources
  create(): any;
  // to be implemented by subclass

  // update is for updating resources when props change
  update(): any;
  // to be implemented by subclass
  // run is called during the main loop or when the instance needs to perform work
  run(): any;
  // to be implemented by subclass
  // free is called during cleanup
  free(): any;
  // to be implemented by subclass
}
// wrapper functions that handle lifecycle
export function create<T extends Lifecycle>(x: T) {
  if (x.created) return;
  const r = x.create();
  x.created = true;
  return r;
}
export function update<T extends Lifecycle>(x: T) {
  if (x.updated) return;
  create(x); // ensure created
  const r = x.update();
  x.updated = true;
  return r;
}
export function run<T extends Lifecycle>(x: T) {
  update(x); // ensure updated
  return x.run();
}
export function free<T extends Lifecycle>(x: T) {
  if (!x.created) return;
  const r = x.free();
  x.created = false;
  x.updated = false;
  return r;
}
