/*****=== MODULE: TIMEOUT AND INTERVALS ====**********/
/*****Author: skymen                        **********/
/*****Description: Exports two functions:   **********/
/*****  interval: works like setInterval    **********/
/*****  timeout: works like setTimeout      **********/
/*****                                      **********/
/*****Both count time in seconds instead of **********/
/*****milliseconds and respect time scale   **********/
/*****                                      **********/
/*****======================================**********/

(function () {
    // Init and get runtime
    runOnStartup(async runtime =>
    {
        // Code to run on the loading screen.
        // Note layouts, objects etc. are not yet available.

        runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
		
		//Save a local copy of runtime
		__runtime = runtime;
    });

    function OnBeforeProjectStart(runtime)
    {
        // Code to run just before 'On start of layout' on
        // the first layout. Loading has finished and initial
        // instances are created and available to use here.

        runtime.addEventListener("tick", () => Tick(runtime));

        //runtime.getAllLayouts().forEach(layout => {
        //    layout.addEventListener("beforelayoutstart", () => StartOfLayout(layout, runtime))
        //});
    }

    // Init local vars
	let __runtime = null;	
	let userCanPop = true;
	let initialized = false;
	const bubbleList = [];
	const objectList = [];
	let objectsArray = [];
	
	let newBubble = null;

	globalThis.main__init = async () => {
		__runtime.objects.bubblepopspritesheet.getAllInstances().forEach((sheet) => {
			sheet.destroy();
		});

		if(!initialized) {
			const mainJsonURL = await __runtime.assets.getProjectFileUrl("Main.json");
			const mainJsonResponse = await __runtime.assets.fetchJson(mainJsonURL);

			let loadObjects = [];
			globalThis.main__loadSounds.forEach((sound) => {
				loadObjects = loadObjects.concat(mainJsonResponse.objectMap[sound]);
			})
			

			__runtime.objects.Bubble.getAllInstances().forEach((bubble) => {
				bubble.destroy();
			});

			const bubblePosArray = mainJsonResponse.initialBubblePositions;
			objectsArray = loadObjects;

			for(let ndx = 0; ndx < bubblePosArray.length; ++ndx) {
				const x = bubblePosArray[ndx][0];
				const y = bubblePosArray[ndx][1];
				const bubble = await __runtime.objects.Bubble.createInstance(0, x, y);
				//bubbleInstance.behaviors.Physics.set
				bubble.behaviors.Physics.isEnabled = false;
				bubble.width = 400;
				bubble.height = 400;
				
				bubbleList.push(bubble);

				const selectedObject = objectsArray.splice(Math.floor(Math.random() * objectsArray.length), 1)[0];

				bubble.instVars.childObject = selectedObject;

				const objectInstance = await __runtime.objects[selectedObject].createInstance(0, x, y);
				objectInstance.width = 300;
				objectInstance.height = 300;
				objectInstance.instVars.name = selectedObject;
				objectInstance.behaviors.Physics.isEnabled = false;
				
				objectList.push(objectInstance);

				await __runtime.callFunction("attachObject", objectInstance.uid, bubble.uid);
				await __runtime.callFunction("setupBubblePhysics", bubble.uid);
			}

			//__runtime.objects.leftCoral.moveToTop();
			//__runtime.objects.rightCoral.moveToTop();

		}
		else {
			for(let ndx = 0; ndx < bubbleList.length; ++ndx) {
				const bubble = bubbleList[ndx];
				if(bubble != null && bubble.uid > 0) {
					await __runtime.callFunction("attachObject", objectList[ndx].uid, bubble.uid);
				}
			}
			if(objectsArray.length > 0) {
				const bubble = await __runtime.objects.Bubble.createInstance(0, -300, 500);
				bubble.width = 400;
				bubble.height = 400;
				bubbleList.push(bubble);
				
				const selectedObject = objectsArray.splice(Math.floor(Math.random() * objectsArray.length), 1)[0];

				bubble.instVars.childObject = selectedObject;

				const objectInstance = await __runtime.objects[selectedObject].createInstance(0, -300, 500);
				objectInstance.width = 300;
				objectInstance.height = 300;
				objectInstance.instVars.name = selectedObject;
				objectInstance.behaviors.Physics.isEnabled = false;
				objectList.push(objectInstance);
				await __runtime.callFunction("setupBubblePhysics", bubble.uid);
				await __runtime.callFunction("attachObject", objectInstance.uid, bubble.uid);
				
				newBubble = bubble;

			}
		}
		await __runtime.callFunction("initCrabPosition");
		initialized = true;
	}
	
	globalThis.main__bubble_tapped = async (bubble) => {
		if(userCanPop) {
			userCanPop = false;
			
			const childObject = bubble.instVars.childObject;
			
			const bubblePopAnimation = await __runtime.objects.bubblepopspritesheet.createInstance(0, 0, 0);
			await __runtime.callFunction("popBubble", bubble.uid);
			await __runtime.callFunction("dropObject", childObject);
		} else {
		  //flash object in crabs hand
		}
	}
	
	globalThis.main__object_tapped = async () => {
		userCanPop = true;
	}



    // Local functions for more processing
    function StartOfLayout(layout, runtime) {
        timeouts = [];
    }

    function Tick(runtime)
    {
		if(newBubble !== null && newBubble.x < 200) {
			newBubble.x += 1;
		}
		else if(newBubble !== null) {
			__runtime.callFunction("setupBubblePhysics", newBubble.uid);
			newBubble = null;
		}
        //let dt = runtime.gameTime - curTime;
        //curTime = runtime.gameTime;
		
		
		
        /*for(let i = 0; i < timeouts.length; i++) {
            let cur = timeouts[i];
            cur.current -= dt;
            if (cur.current <= 0) {
                cur.callback()
                if (cur.isInterval) {
                    cur.current = cur.duration;
                } else {
                    timeouts.splice(i, 1);
                    i--;
                }
            }
        }*/
    }
})();
