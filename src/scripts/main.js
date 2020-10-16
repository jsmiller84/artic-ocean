
class Main {

  constructor(runtime) {
    // **********************************************
    // Construct 3 properties
    // **********************************************

    // Construct 3 runtime
    this.runtime = runtime;

	this.initialized = false;
	this.objectsInitialized = false;
	
    this.initialBubblePositions = null;
	this.mainObjectMap = null;
	this.objectsList = [];
    this.userCanPop = true;
	this.bubbleList = [];
	this.createdObjectList = [];
	this.newBubble = null;
	
	this.coinList = [];
	this.intervalID = null;
	this.coinsGenerated = 0;
	
	this.runtime.addEventListener("beforeprojectstart", () => this.onBeforeProjectStart());
  }
  
  async init(loadSounds) {
  	if(!this.initialized) {
      const mainJsonURL = await this.runtime.assets.getProjectFileUrl("Main.json");
      const mainJsonResponse = await this.runtime.assets.fetchJson(mainJsonURL);
	  
	  this.initialBubblePositions = mainJsonResponse.initialBubblePositions;
	  this.mainObjectMap = mainJsonResponse.objectMap;
	  
	  this.initializeSelectedObjects(loadSounds);
	  this.initialized = true;
	}
	await this.setupScene();
  }
  
  initializeSelectedObjects(loadSounds) {
    loadSounds.forEach((sound) => {
	  if(sound.sound in this.mainObjectMap) {
	    //mainObject could be an object or array of items
	    const mainObject = this.mainObjectMap[sound.sound];
	    if(sound.placement && sound.placement in mainObject) {
		  this.objectsList.push(...mainObject[sound.placement]);
		} else {
		  if(Array.isArray(mainObject)) {
		  	this.objectsList.push(...mainObject);
		  } else {
		    for(const key in mainObject) {
			  this.objectsList.push(...mainObject[key]);
			}
		  }
		}
	  }
	})
	this.objectsList = [...new Set(this.objectsList)];
  }
  
  onBeforeProjectStart() {
    this.runtime.addEventListener("tick", () => this.tick());
  }
  
  async setupScene() {
    
	this.runtime.objects.bubblepopspritesheet.getAllInstances().forEach((sheet) => {
      sheet.destroy();
    });
	
	if(!this.objectsInitialized) {
	  this.runtime.objects.Bubble.getAllInstances().forEach((bubble) => {
	    bubble.destroy();
	  });

      const objectListLength = this.objectsList.length;
      for(let ndx = 0; ndx < this.initialBubblePositions.length && ndx < objectListLength; ++ndx) {
        const x = this.initialBubblePositions[ndx][0];
        const y = this.initialBubblePositions[ndx][1];
	    const bubble = await this.runtime.objects.Bubble.createInstance(0, x, y);
	  
	    //bubbleInstance.behaviors.Physics.set
		bubble.behaviors.Physics.isEnabled = false;
		bubble.width = 400;
		bubble.height = 400;

		this.bubbleList.push(bubble);
		const selectedObject = this.objectsList.splice(Math.floor(Math.random() * this.objectsList.length), 1)[0];
		bubble.instVars.childObject = selectedObject;

		const objectInstance = await this.runtime.objects[selectedObject].createInstance(0, x, y);
		objectInstance.width = 300;
		objectInstance.height = 300;
		objectInstance.instVars.name = selectedObject;
		objectInstance.behaviors.Physics.isEnabled = false;

		this.createdObjectList.push(objectInstance);
		await this.runtime.callFunction("attachObject", objectInstance.uid, bubble.uid);
		await this.runtime.callFunction("setupBubblePhysics", bubble.uid);
	  }
	  this.objectsInitialized = true;
	} else {
	  await this.startCoinAnimation();
      for(let ndx = 0; ndx < this.bubbleList.length; ++ndx) {
        const bubble = this.bubbleList[ndx];
		if(bubble != null && bubble.uid > 0) {
		  await this.runtime.callFunction("attachObject", this.createdObjectList[ndx].uid, bubble.uid);
		}
	  }
	  if(this.objectsList.length > 0) {
	    const bubble = await this.runtime.objects.Bubble.createInstance(0, -300, 500);
	    bubble.width = 400;
	    bubble.height = 400;
	    this.bubbleList.push(bubble);
				
		const selectedObject = this.objectsList.splice(Math.floor(Math.random() * this.objectsList.length), 1)[0];

		bubble.instVars.childObject = selectedObject;

		const objectInstance = await this.runtime.objects[selectedObject].createInstance(0, -300, 500);
		objectInstance.width = 300;
		objectInstance.height = 300;
		objectInstance.instVars.name = selectedObject;
		objectInstance.behaviors.Physics.isEnabled = false;
		this.createdObjectList.push(objectInstance);
		await this.runtime.callFunction("setupBubblePhysics", bubble.uid);
		await this.runtime.callFunction("attachObject", objectInstance.uid, bubble.uid);
				
		this.newBubble = bubble;
	  }
	}
    await this.runtime.callFunction("initCrabPosition");
  }
  
  async startCoinAnimation() {
    this.intervalID = setInterval(this.processCoinAnimation.bind(this), 450);
  }
  
  async processCoinAnimation() {
    if(this.coinsGenerated < 5) {
      const coin = await this.runtime.objects.coin.createInstance(0, -95, -40);
	  this.coinList.push(coin);
	  this.coinsGenerated++;
	  await this.runtime.callFunction("startCoinToChest", coin.uid);
	
	  if(this.coinsGenerated === 2) {
	    await this.runtime.callFunction("openChest");
	  }
	}
	else {
	  clearInterval(this.intervalID);
	}
  }
  
  async coinFinished() {
    if(this.coinList.length) {
	  this.coinList[0].destroy();
	  this.coinList.splice(0, 1);
	}
	if(this.coinList.length === 0) {
	  this.coinsGenerated = 0;
	  await this.runtime.callFunction("closeChest");
	}
  }
  
  async bubbleTapped(bubble) {
    if(this.userCanPop) {
      this.userCanPop = false;
			
	  const childObject = bubble.instVars.childObject;
			
	  const bubblePopAnimation = await this.runtime.objects.bubblepopspritesheet.createInstance(0, 0, 0);
	  await this.runtime.callFunction("popBubble", bubble.uid);
	  await this.runtime.callFunction("dropObject", childObject);
	} else {
       //flash object in crabs hand
	}
  }
  
  tick() {
    if(this.newBubble !== null && this.newBubble.x < 200) {
	  this.newBubble.x += 1;
	}
    else if(this.newBubble !== null) {
	  this.runtime.callFunction("setupBubblePhysics", this.newBubble.uid);
	  this.newBubble = null;
	}
  }
}

(function () {
  // Init local vars
  let main = null;

  // Init and get runtime
  runOnStartup(async runtime => {
    if(!main) {
	  main = new Main(runtime);
	}
  });
  
  globalThis.main__init = async () => {
    await main.init(globalThis.main__loadSounds);
  }

  globalThis.main__bubble_tapped = async (bubble) => {
    await main.bubbleTapped(bubble);
  }
	
  globalThis.main__object_tapped = async () => {
    main.userCanPop = true;
  }  
  
  globalThis.main__coinFinished = async() => {
    await main.coinFinished();
  }
})()

	