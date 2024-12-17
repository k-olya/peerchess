import { Lifecycle } from "lib/lifecycle";

export interface GLContextState {
  [key: string]: any;
}

export class GLContext extends Lifecycle<GLContext> {
  gl: WebGL2RenderingContext;
  state: GLContextState = {};
  toSet: GLContextState = {};
  constructor(gl: WebGL2RenderingContext) {
    super();
    this.gl = gl;
  }

  onUpdate() {
    for (const key in this.toSet) {
      this.state[key] = this.toSet[key];
      delete this.toSet[key];
    }
  }

  set(key: string, value: any) {
    if (this.state[key] === value) {
      delete this.toSet[key];
      return;
    }
    this.toSet[key] = value;
  }

  get(key: string) {
    if (this.toSet[key] !== undefined) {
      return this.toSet[key];
    }
    return this.state[key];
  }

  onRun() {
    return this;
  }
}
