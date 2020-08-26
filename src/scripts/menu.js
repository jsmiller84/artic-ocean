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

  let xTextStartPosition = 600;
  const yTextStartPosition = 200;
  //this is for toggle buttons to be able to toggle sounds on and off
  const uidToSoundMap = {};
  //sound to array of placement uids
  const soundPlacementUIDMap = {}


  globalThis.menu__init = async () => {

    if (!initialized) {
      const menuJsonURL = await __runtime.assets.getProjectFileUrl("Menu.json");
      const menuJsonResponse = await __runtime.assets.fetchJson(menuJsonURL);

      soundPages = menuJsonResponse.pages;
      initialized = true;
    }
    await setPage(_pageNumber);
	xTextStartPosition += 1250;
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
    const marginTop = 35;

    for (let ndx = 0; ndx < soundList.length; ++ndx) {
      //this is the margin between 2 top level sounds
      if (ndx > 0) {
        currY += marginTop;
      }
      // the sound object we are processing for the menu
      let soundObject = soundList[ndx];

      //create the top level letter/sound's text
      const soundGameObject = await createText(soundObject.sound, currX + 220, currY + 10, 60, 125);
      //create the top level letter/sound's toggle button
      const toggleGameObject = await createToggle(soundObject, currX + 165, currY + 55, 60, 60);

      //if the top level soundObject has placement, create the placement text that can be clicked on to enable.
      if ('placement' in soundObject) {
        let localX = currX + 480;

        for (let plNdx = 0; plNdx < soundObject.placement.length; ++plNdx) {
          const placementObject = await createText(soundObject.placement[plNdx], localX, currY + 25, 45, 225);
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
          localX += 285;
        }
      }

      currY += 80;

      if ("blends" in soundObject) {
        for (let bNdx = 0; bNdx < soundObject.blends.length; ++bNdx) {

          const blendSoundObject = soundObject.blends[bNdx];

          const blendGameObject = await createText(blendSoundObject.sound, currX + 280, currY + 10, 50, 135);
          const blendToggleGameObject = await createToggle(blendSoundObject, currX + 235, currY + 55, 50, 50);

          if ('placement' in blendSoundObject) {
            let localX = currX + 480;

            for (let plNdx = 0; plNdx < blendSoundObject.placement.length; ++plNdx) {
              const placementObject = await createText(blendSoundObject.placement[plNdx], localX, currY + 10, 45, 225);

              placementObject.isVisible = false;

              placementObject.instVars.sound = blendSoundObject.sound;
              placementObject.instVars.placement = blendSoundObject.placement[plNdx];
			  placementObject.instVars.canToggle = 1;


              if (!(blendSoundObject.sound in soundPlacementUIDMap)) {
                soundPlacementUIDMap[blendSoundObject.sound] = [];
              }
              soundPlacementUIDMap[blendSoundObject.sound].push(placementObject.uid);

              localX += 285;
            }
          }
          currY += 70;
        }
      }
    }
  }

  async function createText(text, x, y, size, width) {
    const soundObject = await __runtime.objects.ItemText.createInstance(0, x, y);
    soundObject.text = text.toUpperCase();
    soundObject.fontFace = 'FredokaOne-Regular';
    soundObject.sizePt = size;
    soundObject.width = width;
    soundObject.height = 80;
	
	await __runtime.callFunction("pinToVerticalScroll", soundObject.uid);


    return soundObject;
  }

  async function createToggle(object, x, y, width, height) {
    const toggle = await __runtime.objects.Toggle.createInstance(0, x, y);
    toggle.width = width;
    toggle.height = height;
    toggle.instVars.sound = object.sound;
    return toggle;
  }

  globalThis.menu__select_sounds = async (toggleButtons) => {

    toggleButtons.forEach((button) => {
      if (button.animationFrame === 1) {
        selectedSounds.push(button.instVars.refSound);
        //console.log(button.instVars.refSound);
      }
    });
    globalThis.main__loadSounds = selectedSounds;
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
  	console.log(text);
	console.log(soundPlacementUIDMap);
    if(text.isBold == false) {
	    text.text="[color=#00ff00]"+text.instVars.placement.toUpperCase()+"[/color]";
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
