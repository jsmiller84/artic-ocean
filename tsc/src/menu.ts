import { runtime, globalThis } from "./global-object";
import { Main } from "./main";

export class Menu {
  private main: Main;
  // Map from sound placement to Construct 3 UID
  private soundPlacementUIDMap;
  private initialized: boolean;
  private soundPages;
  private objectMap;
  private pageIndex;
  private selectedSounds;
  private selectedList;
  private maxSelectedDisplay;
  private xTextStartPosition;
  private yTextStartPosition;
  private marginTop;

  constructor(main) {
    // **********************************************
    // Construct 3 properties
    // **********************************************
    this.main = main;

    // Map from sound placement to Construct 3 UID
    this.soundPlacementUIDMap = {};

    // state if the menu has been initialized yet 
    this.initialized = false;

    // **********************************************
    // Imported from JSON file
    // **********************************************
    // object containing all sound pages that will be displayed
    this.soundPages = null;
    // map from letter to objects
    this.objectMap = null;
    // **********************************************

    this.pageIndex = 0;

    this.selectedSounds = [];

    this.selectedList = [];
    // {
    //   sound: string,
    //   placement?: string
    // }
    this.maxSelectedDisplay = 13;

    this.xTextStartPosition = 500;
    this.yTextStartPosition = 350;

    this.marginTop = 125;

    this.setupConstructCallbacks();
  }

  setupConstructCallbacks() {
    globalThis().menu__init = async () => await this.init();
    globalThis().menu__toggle_pageUp = async () => await this.pageDown();
    globalThis().menu__toggle_pageDown = async () => await this.pageUp();
    globalThis().menu__toggle_button = async (button) => await this.toggleButton(button);
    globalThis().menu__toggle_placement = async (text) => await this.togglePlacement(text);

    globalThis().menu__select_sounds = async () => {
      this.main.setLoadSounds(this.selectedList);
      runtime().goToLayout("Main");
    }
  }

  async init() {

    if (!this.initialized) {
      const menuJsonURL = await runtime().assets.getProjectFileUrl("Menu.json");
      const menuJsonResponse = await runtime().assets.fetchJson(menuJsonURL);

      const mainJsonURL = await runtime().assets.getProjectFileUrl("Main.json");
      const mainJsonResponse = await runtime().assets.fetchJson(mainJsonURL);

      this.soundPages = menuJsonResponse.pages;
      this.objectMap = mainJsonResponse.objectMap;

      this.initialized = true;
    }
    await this.setPage(this.pageIndex);
  }

  async setPage(pageNumber) {
    this.soundPlacementUIDMap = {};

    runtime().objects.ItemText.getAllInstances().forEach((text) => {
      text.destroy();
    });

    runtime().objects.Toggle.getAllInstances().forEach((text) => {
      text.destroy();
    });

    runtime().objects.SoundBorder.getAllInstances().forEach((border) => {
      border.destroy();
    });
    const currentPage = this.soundPages[pageNumber];

    let currX = this.xTextStartPosition;

    for (let colNdx = 0; colNdx < currentPage.columns.length; ++colNdx) {

      const soundList = currentPage.columns[colNdx].sounds;

      let currY = this.yTextStartPosition;

      for (let ndx = 0; ndx < soundList.length; ++ndx) {
        //this is the margin between 2 top level sounds
        if (ndx > 0) {
          currY += this.marginTop;
        }
        // the sound object we are processing for the menu
        let soundObject = soundList[ndx];

        //create the top level letter/sound's text
        const soundGameObject = await this.createText(soundObject.sound, currX + 220, currY + 20, 55, 125, 100);
        //create the top level letter/sound's toggle button
        const toggleGameObject = await this.createToggle(soundObject, currX + 165, currY + 65, 60, 60);

        const topY = currY;

        //if the top level soundObject has placement, create the placement text that can be clicked on to enable.
        if ('placement' in soundObject) {
          let localX = currX + 380;

          for (let plNdx = 0; plNdx < soundObject.placement.length; ++plNdx) {
            const placementObject = await this.createText(soundObject.placement[plNdx], localX, currY + 40, 35, 225, 60);
            //need to make sure this text can be clicked.
            placementObject.isVisible = false;

            if (this.selectedList.find(item => item.sound === soundObject.sound)) {
              placementObject.isVisible = true;
            }

            //store sound and placement in the object for use later
            placementObject.instVars.sound = soundObject.sound;
            placementObject.instVars.placement = soundObject.placement[plNdx];
            placementObject.instVars.canToggle = 1;

            if (this.selectedList.find(item => item.sound === soundObject.sound)) {
              placementObject.isVisible = true;
            }

            if (this.selectedList.find(item => item.sound === soundObject.sound && item.placement === placementObject.instVars.placement)) {
              placementObject.text = "[color=#00857B]" + placementObject.instVars.placement.toUpperCase() + "[/color]";
              placementObject.isBold = true;
            }

            //map of sound to placement uids... to be visible later
            if (!(soundObject.sound in this.soundPlacementUIDMap)) {
              this.soundPlacementUIDMap[soundObject.sound] = [];
            }
            this.soundPlacementUIDMap[soundObject.sound].push(placementObject.uid);
            localX += 200;
          }
        }

        if ("blends" in soundObject) {
          currY += 100;
        } else {
          currY += 80;
        }

        if ("blends" in soundObject) {
          for (let bNdx = 0; bNdx < soundObject.blends.length; ++bNdx) {

            const blendSoundObject = soundObject.blends[bNdx];

            const blendToggleGameObject = await this.createToggle(blendSoundObject, currX + 185, currY + 55, 50, 50);
            const blendGameObject = await this.createText(blendSoundObject.sound, currX + 230, currY + 20, 40, 135, 100);


            if ('placement' in blendSoundObject) {
              let localX = currX + 380;

              for (let plNdx = 0; plNdx < blendSoundObject.placement.length; ++plNdx) {
                const placementObject = await this.createText(blendSoundObject.placement[plNdx], localX, currY + 20, 35, 225, 60);

                placementObject.isVisible = false;
                placementObject.instVars.sound = blendSoundObject.sound;
                placementObject.instVars.placement = blendSoundObject.placement[plNdx];
                placementObject.instVars.canToggle = 1;

                if (this.selectedList.find(item => item.sound === blendSoundObject.sound)) {
                  placementObject.isVisible = true;
                }

                if (this.selectedList.find(item => item.sound === blendSoundObject.sound && item.placement === placementObject.instVars.placement)) {
                  placementObject.text = "[color=#00857B]" + placementObject.instVars.placement.toUpperCase() + "[/color]";
                  placementObject.isBold = true;
                }

                if (!(blendSoundObject.sound in this.soundPlacementUIDMap)) {
                  this.soundPlacementUIDMap[blendSoundObject.sound] = [];
                }
                this.soundPlacementUIDMap[blendSoundObject.sound].push(placementObject.uid);

                localX += 200;
              }
            }
            currY += 70;
          }
        }

        const topBorder = await runtime().objects.SoundBorder.createInstance(1, currX + 100, topY);
        topBorder.height = 10;
        topBorder.width = 900;

        const leftBorder = await runtime().objects.SoundBorder.createInstance(1, currX + 100, topY);
        leftBorder.height = (currY - topY) + 40;
        leftBorder.width = 10;

        const rightBorder = await runtime().objects.SoundBorder.createInstance(1, (currX + 100) + 890, topY);
        rightBorder.height = (currY - topY) + 40;
        rightBorder.width = 10;

        const bottomBorder = await runtime().objects.SoundBorder.createInstance(1, (currX + 100), currY + 40);
        bottomBorder.height = 10;
        bottomBorder.width = 900;
      }
      if (colNdx + 1 < currentPage.columns.length)
        currX += 975;
    };
    await this.setupSelectedSounds();
  }

  /**
   * Populates the selected sounds box
   */
  async setupSelectedSounds() {
    runtime().objects.SelectedText.getAllInstances().forEach((text) => {
      text.destroy();
    });

    let xPos = this.xTextStartPosition + (975 * 2);
    let yPos = this.yTextStartPosition;

    const topBorder = await runtime().objects.SoundBorder.createInstance(0, xPos + 100, yPos);
    topBorder.height = 10;
    topBorder.width = 700;

    const bottomBorder = await runtime().objects.SoundBorder.createInstance(0, xPos + 100, yPos + 1300);
    bottomBorder.height = 10;
    bottomBorder.width = 700;

    const leftBorder = await runtime().objects.SoundBorder.createInstance(0, xPos + 100, yPos);
    leftBorder.height = 1300;
    leftBorder.width = 10;

    const rightBorder = await runtime().objects.SoundBorder.createInstance(0, xPos + 790, yPos);
    rightBorder.height = 1300;
    rightBorder.width = 10;

    const soundsTitle = await this.createText("", xPos + 150, yPos + 20, 55, 350, 100);
    soundsTitle.text = "[color=#00857B]Sounds[/color]";
    soundsTitle.isBold = true;

    yPos += 130;

    this.selectedList.sort((el1, el2) => {
      if (el1.sound === el2.sound) {
        if (el1.placement === "initial")
          return -1;
        else if (el1.placement === "medial" && el2.placement === "initial")
          return 1;
        else if (el1.placement === "medial")
          return -1;
        else if (el1.placement === "final")
          return 1;
      }
      return el1.sound.localeCompare(el2.sound);
    });

    for (let ndx = 0; ndx < this.selectedList.length && ndx < this.maxSelectedDisplay; ++ndx) {
      let selectedSound = this.selectedList[ndx];
      const soundText = await this.createSelectedText(selectedSound.sound.toUpperCase(), xPos + 150, yPos, 50, 350);
      if (selectedSound.placement) {
        const placementText = await this.createSelectedText(this.capitalize(selectedSound.placement), xPos + 300, yPos, 50, 350);
      }
      yPos += 80;
    }
    if (this.selectedList.length > this.maxSelectedDisplay) {
      await this.createSelectedText("...", xPos + 450, yPos, 50, 350);
    }
  }

  /**
   * Utility function to create text
   */
  async createText(text, x, y, size, width, height) {
    const soundObject = await runtime().objects.ItemText.createInstance(0, x, y);
    soundObject.text = "[color=#703c4d]" + text.toUpperCase() + "[/color]";

    soundObject.fontFace = 'sofiapro-bold';
    soundObject.sizePt = size;
    soundObject.width = width;
    soundObject.height = height;

    return soundObject;
  }

  /**
   * Utility function to create text in the selected area
   * Think about replacing this in the future.. this is a short cut so that I don't
   * destroy this text on a page up and down
   */
  async createSelectedText(text, x, y, size, width) {
    const soundObject = await runtime().objects.SelectedText.createInstance(0, x, y);
    soundObject.text = "[color=#00857B]" + text + "[/color]";

    soundObject.fontFace = 'sofiapro-bold';
    soundObject.sizePt = size;
    soundObject.width = width;
    soundObject.height = 100;

    return soundObject;
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }


  async createToggle(object, x, y, width, height) {
    const toggle = await runtime().objects.Toggle.createInstance(0, x, y);
    toggle.width = width;
    toggle.height = height;
    toggle.instVars.sound = object.sound;

    if (this.selectedList.find(item => item.sound === object.sound)) {
      toggle.animationFrame = 1;
    }
    return toggle;
  }

  async getSelectedSoundObjects() {
    //add logic here to iterate the list of selected sounds and placements, and add objects that should be used 
    /*    toggleButtons.forEach((button) => {
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
      });*/

    return [];
  }

  async pageUp() {
    this.pageIndex++;
    if (this.pageIndex >= this.soundPages.length) {
      this.pageIndex = 0;
    }
    this.setPage(this.pageIndex);
  }

  async pageDown() {
    this.pageIndex--;
    if (this.pageIndex < 0) {
      this.pageIndex = this.soundPages.length - 1;
    }
    this.setPage(this.pageIndex);
  }

  async toggleButton(button) {

    if (button.animationFrame === 0) {
      button.animationFrame = 1;
      //initial.
    }
    else {
      button.animationFrame = 0;
    }

    const uidArray = this.soundPlacementUIDMap[button.instVars.sound];
    if (uidArray) {
      uidArray.forEach((uid) => {
        const placementObject = runtime().getInstanceByUid(uid);
        placementObject.isVisible = (button.animationFrame === 1);
        if (!placementObject.isVisible) {
          placementObject.text = "[color=#703c4d]" + placementObject.instVars.placement.toUpperCase() + "[/color]";
          placementObject.isBold = false;
        }
      });
    }

    let soundFound = false;
    const sound = button.instVars.sound;

    for (let ndx = this.selectedList.length - 1; ndx >= 0; --ndx) {
      const soundObject = this.selectedList[ndx];
      if (soundObject.sound === sound) {
        if (button.animationFrame === 0) {
          this.selectedList.splice(ndx, 1);
          soundFound = true;
        }
      }
    }
    if (!soundFound && button.animationFrame === 1) {
      this.selectedList.push({ sound: sound });
    }
    await this.setupSelectedSounds();
  }

  async togglePlacement(text) {
    const placement = text.instVars.placement;
    const sound = text.instVars.sound;
    if (text.isBold == false) {
      text.text = "[color=#00857B]" + placement.toUpperCase() + "[/color]";
      text.isBold = true;
    }
    else {
      text.text = "[color=#703c4d]" + placement.toUpperCase() + "[/color]";
      text.isBold = false;
    }

    for (let ndx = this.selectedList.length - 1; ndx >= 0; --ndx) {
      const soundObject = this.selectedList[ndx];
      if (soundObject.sound === sound) {
        if (!text.isBold) {
          if (soundObject.placement === placement) {
            delete soundObject.placement;
            //figure out if we need to delete this object
            for (let ndx2 = this.selectedList.length - 1; ndx2 >= 0; --ndx2) {
              let foundObject = this.selectedList[ndx2];
              if (foundObject.sound === sound &&
                foundObject.placement) {
                this.selectedList.splice(ndx, 1);
                break;
              }
            }
            break;
          }
          continue;
        }
        else {
          if (soundObject.placement) {
            this.selectedList.push({ sound: sound, placement: placement });
          } else {
            soundObject.placement = placement;
          }
          break;
        }
      }
    }
    this.setupSelectedSounds();
  }
}
