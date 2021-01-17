import { Main } from './main'
import { Menu } from './menu'
import { GlobalObject } from './global-object'

export class ObjectManager { 
  private main: Main;
  private menu: Menu;

  constructor(runtime, globalThis) {
    GlobalObject.getInstance().setRuntime(runtime);
    GlobalObject.getInstance().setGlobalThis(globalThis);
    
    this.main = new Main();
    this.menu = new Menu(this.main);
  }
}