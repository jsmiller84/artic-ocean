import { runtime, globalThis } from "./global-object";
import { Main } from "./main";

export class Store {
  private main: Main;

  private storeObjects : Array<any>;
  private initialized: boolean;

  constructor(main) {
    // **********************************************
    // Construct 3 properties
    // **********************************************
    this.main = main;

    // state if the menu has been initialized yet 
    this.initialized = false;

    // **********************************************
    // Imported from JSON file
    // **********************************************
    // object containing all sound pages that will be displayed
    this.storeObjects = null;
    // **********************************************

    this.setupConstructCallbacks();
  }

  setupConstructCallbacks() {
    globalThis().store__init = async () => await this.init();
    globalThis().store__buttonClicked = async (button) => await this.buttonClicked(button);
    globalThis().store__backButtonClicked = async () => await this.backToMain();

  }

  async init() {

    if (!this.initialized) {
      const storeJsonURL = await runtime().assets.getProjectFileUrl("Store.json");
      const storeJsonResponse = await runtime().assets.fetchJson(storeJsonURL);

      console.log(runtime());
      console.log(globalThis());

      this.storeObjects = storeJsonResponse.objects;
      this.initialized = true;
    }
    await this.setupPage();
  }

  async setupPage() {
    console.log(this.storeObjects);
    console.log(runtime().objects);

    let objectX = 850;
    let objectY = 560;

    let buttonX = 850;
    let buttonY = 880;

    let coinX = 785;
    let coinY = 885;

    let textX = 835;
    let textY = 830;

    for(let ndx = 0; ndx < this.storeObjects.length; ++ndx) {
      const objectName = this.storeObjects[ndx].name;
      const objectCost = this.storeObjects[ndx].cost;

      const ox = objectX + ((ndx % 5) * 550);
      const oy = objectY + (Math.floor(ndx / 5) * 780);
      const object = await runtime().objects[objectName].createInstance(0, ox, oy);
      object.width = 450;
      object.height = 450;

      const bx = buttonX + ((ndx % 5) * 550);
      const by = buttonY + (Math.floor(ndx / 5) * 780);
      const button = await runtime().objects.woodButton.createInstance(0, bx, by);
      button.width = 385;
      button.height = 135;

      const cx = coinX + ((ndx % 5) * 550);
      const cy = coinY + (Math.floor(ndx / 5) * 780);
      const coin = await runtime().objects.coin.createInstance(0, cx, cy);
      coin.width = 100;
      coin.height = 100;

      const tx = textX + ((ndx % 5) * 550);
      const ty = textY + (Math.floor(ndx / 5) * 780);
      const text = await runtime().objects.CostText.createInstance(0, tx, ty);
      text.text = runtime().globalVars.score >= objectCost ? "[color=#00ff00]" + objectCost + "[/color]" : "[color=#ff0000]" + objectCost + "[/color]";
      text.fontFace = 'sofiapro-bold';
      text.sizePt = 60;

      await runtime().callFunction("setupSticker", object.uid);

      button.instVars = {};
      button.instVars.name = objectName;
    }
  }

  async buttonClicked(button) {
    const obj = this.storeObjects.find((obj) => obj.name === button.instVars.name);
    if(runtime().globalVars.score >= obj.cost) {
      this.main.addSticker(obj);
      runtime().globalVars.score -= obj.cost;
      runtime().goToLayout("Main");  
    }
  }

  async backToMain() {
    this.main.addSticker(null);
    runtime().goToLayout("Main");
  }
}
