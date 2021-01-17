
import { Main } from './main'
import { Menu } from './menu'
import { ObjectManager } from './object-manager';

declare function runOnStartup(runtime);

(function () {
  // Init and get runtime
  runOnStartup(async runtime => {
    let objectManager = new ObjectManager(runtime, globalThis);
  });

})()

