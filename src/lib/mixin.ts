// a constructor function type for creating class mixins
export type Constructor<T = {}> = new (...args: any[]) => T;

// usage:
function Mixin<T extends Constructor>(Base: T) {
  return class extends Base {
    log() {
      console.log("hello world! all your base are belong to us");
    }
  };
}
