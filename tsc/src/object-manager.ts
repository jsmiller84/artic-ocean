import { Main } from './main'
import { Menu } from './menu'
import { GlobalObject } from './global-object'
import { Store } from './store';

export class ObjectManager { 
  private main: Main;
  private menu: Menu;
  private store: Store;

  constructor(runtime, globalThis) {
    GlobalObject.getInstance().setRuntime(runtime);
    GlobalObject.getInstance().setGlobalThis(globalThis);
    
    this.main = new Main();
    this.menu = new Menu(this.main);
    this.store = new Store(this.main);
  }
}