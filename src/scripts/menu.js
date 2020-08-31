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
  runOnStartup(async runtime => {
    // Code to run on the loading screen.
    // Note layouts, objects etc. are not yet available.

    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));

    //Save a local copy of runtime
    __runtime = runtime;
  });

  function OnBeforeProjectStart(runtime) {
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
  let initialized = false;
  //current page
  let _pageNumber = 1;
  
  //array of sound objects that have been selected
  // { sound: <letter>, placement?: <initial, medial, final> }
  let selectedSounds = [];

  //object containing all sound pages that will be displayed
  let soundPages = null;
  
  let objectMap = null;
  
  let xTextStartPosition = 500;
  const yTextStartPosition = 200;
  //this is for toggle buttons to be able to toggle sounds on and off
  const uidToSoundMap = {};
  //sound to array of placement uids
  const soundPlacementUIDMap = {}


  globalThis.menu__init = async () => {

    if (!initialized) {
      const menuJsonURL = await __runtime.assets.getProjectFileUrl("Menu.json");
      const menuJsonResponse = await __runtime.assets.fetchJson(menuJsonURL);
	  
	  const mainJsonURL = await __runtime.assets.getProjectFileUrl("Main.json");
	  const mainJsonResponse = await __runtime.assets.fetchJson(mainJsonURL);

      soundPages = menuJsonResponse.pages;
	  objectMap = mainJsonResponse.objectMap;
	  
      initialized = true;
    }
    await setPage(_pageNumber);
	xTextStartPosition += 1100;
	await setPage(_pageNumber + 1);
  }

  async function setPage(pageNumber) {

    //__runtime.objects.ItemText.getAllInstances().forEach((text) => {
    //  text.destroy();
    //});

    //__runtime.objects.Toggle.getAllInstances().forEach((toggle) => {
    //  toggle.destroy();
    //});

    const currentPage = soundPages.find(page => page.page === pageNumber);

    //list of sound objects to display
    const soundList = currentPage.sounds;

    let currX = xTextStartPosition;
    let currY = yTextStartPosition;
    const marginTop = 100;

    for (let ndx = 0; ndx < soundList.length; ++ndx) {
      //this is the margin between 2 top level sounds
      if (ndx > 0) {
        currY += marginTop;
      }
      // the sound object we are processing for the menu
      let soundObject = soundList[ndx];

      //create the top level letter/sound's text
      const soundGameObject = await createText(soundObject.sound, currX + 220, currY + 10, 45, 125);
      //create the top level letter/sound's toggle button
      const toggleGameObject = await createToggle(soundObject, currX + 165, currY + 55, 60, 60);

      const topBorder = await __runtime.objects.SoundBorder.createInstance(0, currX + 100, currY);
	  topBorder.height = 14;
	  topBorder.width = 1000;
	  const topY = currY;

      //if the top level soundObject has placement, create the placement text that can be clicked on to enable.
      if ('placement' in soundObject) {
        let localX = currX + 380;

        for (let plNdx = 0; plNdx < soundObject.placement.length; ++plNdx) {
          const placementObject = await createText(soundObject.placement[plNdx], localX, currY + 25, 35, 225);
          //need to make sure this text can be clicked.
          placementObject.isVisible = false;

          //store sound and placement in the object for use later
          placementObject.instVars.sound = soundObject.sound;
          placementObject.instVars.placement = soundObject.placement[plNdx];
		  placementObject.instVars.canToggle = 1;

          //map of sound to placement uids... to be visible later
          if (!(soundObject.sound in soundPlacementUIDMap)) {
            soundPlacementUIDMap[soundObject.sound] = [];
          }
          soundPlacementUIDMap[soundObject.sound].push(placementObject.uid);
          localX += 240;
        }
      }
      
	  if("blends" in soundObject) {
	    currY += 100;
	  } else {
	    currY += 80;
	  }

      if ("blends" in soundObject) {
        for (let bNdx = 0; bNdx < soundObject.blends.length; ++bNdx) {

          const blendSoundObject = soundObject.blends[bNdx];

          const blendToggleGameObject = await createToggle(blendSoundObject, currX + 185, currY + 55, 50, 50);
		  const blendGameObject = await createText(blendSoundObject.sound, currX + 230, currY + 10, 40, 135);


          if ('placement' in blendSoundObject) {
            let localX = currX + 380;

            for (let plNdx = 0; plNdx < blendSoundObject.placement.length; ++plNdx) {
              const placementObject = await createText(blendSoundObject.placement[plNdx], localX, currY + 10, 35, 225);

              placementObject.isVisible = false;

              placementObject.instVars.sound = blendSoundObject.sound;
              placementObject.instVars.placement = blendSoundObject.placement[plNdx];
			  placementObject.instVars.canToggle = 1;


              if (!(blendSoundObject.sound in soundPlacementUIDMap)) {
                soundPlacementUIDMap[blendSoundObject.sound] = [];
              }
              soundPlacementUIDMap[blendSoundObject.sound].push(placementObject.uid);

              localX += 240;
            }
          }
          currY += 70;
        }
      }
	  const bottomBorder = await __runtime.objects.SoundBorder.createInstance(0, currX + 100, currY + 20);
	  bottomBorder.height = 14;
	  bottomBorder.width = 1000;
	  
	  const leftBorder = await __runtime.objects.SoundBorder.createInstance(0, currX + 100, topY);
	  leftBorder.height = currY - topY + 30;
	  leftBorder.width = 14;
	  
	  const rightBorder = await __runtime.objects.SoundBorder.createInstance(0, currX + 1085, topY);
	  rightBorder.height = currY - topY + 30;
	  rightBorder.width = 14;


	  
    }
  }

  async function createText(text, x, y, size, width) {
    const soundObject = await __runtime.objects.ItemText.createInstance(0, x, y);
    soundObject.text = text.toUpperCase();
    soundObject.fontFace = 'sofiapro-bold';
    soundObject.sizePt = size;
    soundObject.width = width;
    soundObject.height = 100;

    return soundObject;
  }

  async function createToggle(object, x, y, width, height) {
    const toggle = await __runtime.objects.Toggle.createInstance(0, x, y);
    toggle.width = width;
    toggle.height = height;
    toggle.instVars.sound = object.sound;
    return toggle;
  }

  //
  // This function is called before we move onto the main page
  // This will iterate all of the toggle buttons ... which might not be correct
  // in the future.
  globalThis.menu__select_sounds = async (toggleButtons) => {
    
    toggleButtons.forEach((button) => {
	  const sound = button.instVars.sound;
	  
      if (button.animationFrame === 1) {
	    if(sound in soundPlacementUIDMap) {
		  const placementObjects = soundPlacementUIDMap[sound];
		  		  
		  let soundsAdded = false;
		  let placements = [];
		  
		  placementObjects.forEach((uid) => {
		    const textObject = __runtime.getInstanceByUid(uid);
			const placement = textObject.instVars.placement;
			placements.push(placement);
			if(textObject.isBold) {
			  if(placement in objectMap[sound]) {
			    selectedSounds.push(...objectMap[sound][placement]);
				soundsAdded = true;
			  } 
			}
		  });
		  if(!soundsAdded) {
		    if(placements.length) {
			  placements.forEach((placement) => {
			    if(placement in objectMap[sound]) {
				  selectedSounds.push(...objectMap[sound][placement]);
				  soundsAdded = true;
				}
			  });
			}
			if(!soundsAdded) {
		      selectedSounds.push(...objectMap[sound]);
			}
		  }
		} else {
		  selectedSounds.push(...objectMap[sound]);
		}
      }
    });
	console.log("here");
	console.log(selectedSounds);
    globalThis.main__loadSounds = selectedSounds;
	
	__runtime.goToLayout("Main");
  }
  
  globalThis.menu__toggle_pageUp = async() => {
    pageNumber = pageNumber + 1;
	await setPage();
  }
  
  globalThis.menu__toggle_pageDown = async() => {
    pageNumber = pageNumber - 1;
	await setPage();
  }


  globalThis.menu__toggle_button = async (button) => {
    if (button.animationFrame === 0) {
      button.animationFrame = 1;
      //initial.
    }
    else {
      button.animationFrame = 0;
    }
	const uidArray = soundPlacementUIDMap[button.instVars.sound];
	if(uidArray) {
	  uidArray.forEach((uid) => {
        const placementObject = __runtime.getInstanceByUid(uid);
	    placementObject.isVisible = button.animationFrame === 1;
	  });
	}
  }
  
  globalThis.menu__toggle_placement = async(text) => {
	console.log(soundPlacementUIDMap);
    if(text.isBold == false) {
	    text.text="[color=#3DA86B]"+text.instVars.placement.toUpperCase()+"[/color]";
		text.isBold = true;
	}
	else {
	    text.text="[color=#000000]"+text.instVars.placement.toUpperCase()+"[/color]";
		text.isBold = false;
	}
  }


  // Local functions for more processing
  function StartOfLayout(layout, runtime) {
  }

  function Tick(runtime) {
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
