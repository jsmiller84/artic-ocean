
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
  
  async launchCrab() {
  
  }
  
  /**
   * Return the firing solution for a projectile starting at 'src' with
   * velocity 'v', to hit a target, 'dst'.
   *
   * @param Object src position of shooter
   * @param Object dst position & velocity of target
   * @param Number v   speed of projectile
   * @return Object Coordinate at which to fire (and where intercept occurs)
   *
   * E.g.
   * >>> intercept({x:2, y:4}, {x:5, y:7, vx: 2, vy:1}, 5)
   * = {x: 8, y: 8.5}
   */
  //src is the position of the crab
  //dst = position and velocity of the falling object
  async intercept(src, dst, v) {
    let dstLoc = dst.getImagePoint("crabloc");
    let diffX = (src.x - dstLoc[0]);
	let diffY = (src.y - (dstLoc[1] + 600));
	let speed = Math.sqrt((diffX*diffX) + (diffY*diffY));
   
     await this.runtime.callFunction("fireCrab", speed, dst.uid);

	/*
    var tx = dst.x - src.x,
        ty = Math.abs(dst.y - src.y),
        tvx = dst.behaviors.Physics.getVelocityX(), //there is no x velocity since the object is falling straight down
        tvy = -(dst.behaviors.Physics.getVelocityY());

    // Get quadratic equation components
    var a = tvx*tvx + tvy*tvy - v*v;
    var b = 2 * (tvx * tx + tvy * ty);
    var c = tx*tx + ty*ty;    
 
    // Solve quadratic
    var ts = this.quad(a, b, c); // See quad(), below

    // Find smallest positive solution
    var sol = null;
    if (ts) {
      var t0 = ts[0], t1 = ts[1];
      var t = Math.min(t0, t1);
      if (t < 0) t = Math.max(t0, t1);    
      if (t > 0) {
        sol = {
          x: dst.x + 100*t,
          y: dst.y + 100*t
        };
      }
    }
	if(sol !== null) {
	  await this.runtime.callFunction("fireCrab", sol.x, sol.y);
	}
    return sol;*/
  }


  /**
   * Return solutions for quadratic
   */
  
  quad(a,b,c) {
    var sol = null;
    if (Math.abs(a) < 1e-6) {
      if (Math.abs(b) < 1e-6) {
        sol = Math.abs(c) < 1e-6 ? [0,0] : null;
      } else {
        sol = [-c/b, -c/b];
      }
    } else {
      var disc = b*b - 4*a*c;
      if (disc >= 0) {
        disc = Math.sqrt(disc);
        a = 2*a;
        sol = [(-b-disc)/a, (-b+disc)/a];
      }
    }
    return sol;
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
  globalThis.main__setup_projectile = async(objectFamily, crab) => {
    let pos = main.intercept(crab, objectFamily, 400);
  }
})()

	