export function runtime() {
  return GlobalObject.getInstance().getRuntime();
}

export function globalThis() {
  return GlobalObject.getInstance().getGlobalThis();
}

export class GlobalObject {
  private static instance: GlobalObject;

  private runtime;
  private globalThis;

  private constructor() { }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): GlobalObject {
    if (!GlobalObject.instance) {
      GlobalObject.instance = new GlobalObject();
    }
    return GlobalObject.instance;
  }

  public setRuntime(runtime) {
    this.runtime = runtime;
  }

  public getRuntime() {
    console.log(this.runtime);
    return this.runtime;
  }

  public setGlobalThis(globalThis) {
    this.globalThis = globalThis;
  }

  public getGlobalThis() {
    return this.globalThis;
  }
}
