(()=>{"use strict";function t(){return i.getInstance().getRuntime()}function e(){return i.getInstance().getGlobalThis()}class i{constructor(){}static getInstance(){return i.instance||(i.instance=new i),i.instance}setRuntime(t){this.runtime=t}getRuntime(){return console.log(this.runtime),this.runtime}setGlobalThis(t){this.globalThis=t}getGlobalThis(){return this.globalThis}}var s=function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function c(t){try{a(s.next(t))}catch(t){o(t)}}function l(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(c,l)}a((s=s.apply(t,e||[])).next())}))};class n{constructor(){this.initialized=!1,this.objectsInitialized=!1,this.initialBubblePositions=null,this.mainObjectMap=null,this.objectsList=[],this.userCanPop=!0,this.bubbleList=[],this.createdObjectList=[],this.newBubble=null,this.coinList=[],this.intervalID=null,this.coinsGenerated=0,this.loadedSounds=[],this.stickers=[],this.setupConstructCallbacks(),t().addEventListener("beforeprojectstart",(()=>this.onBeforeProjectStart()))}setupConstructCallbacks(){e().main__init=()=>s(this,void 0,void 0,(function*(){yield this.init()})),e().main__bubble_tapped=t=>s(this,void 0,void 0,(function*(){yield this.bubbleTapped(t)})),e().main__object_tapped=()=>s(this,void 0,void 0,(function*(){this.userCanPop=!0})),e().main__setup_projectile=(t,e)=>s(this,void 0,void 0,(function*(){this.intercept(e,t,400)}))}onBeforeProjectStart(){t().addEventListener("tick",(()=>this.tick()))}setLoadSounds(t){this.loadedSounds=t}init(){return s(this,void 0,void 0,(function*(){if(!this.initialized){const e=yield t().assets.getProjectFileUrl("Main.json"),i=yield t().assets.fetchJson(e);this.initialBubblePositions=i.initialBubblePositions,this.mainObjectMap=i.objectMap,this.initializeSelectedObjects(),this.initialized=!0}yield this.setupScene()}))}addSticker(t){this.stickers.push(t)}initializeSelectedObjects(){this.loadedSounds.forEach((t=>{if(t.sound in this.mainObjectMap){const e=this.mainObjectMap[t.sound];if(t.placement&&t.placement in e)this.objectsList.push(...e[t.placement]);else if(Array.isArray(e))this.objectsList.push(...e);else for(const t in e)this.objectsList.push(...e[t])}})),this.objectsList=[...new Set(this.objectsList)]}setupScene(){return s(this,void 0,void 0,(function*(){if(t().objects.bubblepopspritesheet.getAllInstances().forEach((t=>{t.destroy()})),this.objectsInitialized){for(let e=0;e<this.bubbleList.length;++e){const i=this.bubbleList[e];null!=i&&i.uid>0&&(yield t().callFunction("attachObject",this.createdObjectList[e].uid,i.uid))}if(this.objectsList.length>0&&0===this.stickers.length){const e=yield t().objects.Bubble.createInstance(1,500,500);e.width=400,e.height=400,this.bubbleList.push(e);const i=this.objectsList.splice(Math.floor(Math.random()*this.objectsList.length),1)[0];e.instVars.childObject=i;const s=yield t().objects[i].createInstance(1,500,500);s.width=300,s.height=300,s.instVars.name=i,s.behaviors.Physics.isEnabled=!1,this.createdObjectList.push(s),yield t().callFunction("setupBubblePhysics",e.uid),yield t().callFunction("attachObject",s.uid,e.uid)}}else{t().objects.Bubble.getAllInstances().forEach((t=>{t.destroy()}));const e=this.objectsList.length;for(let i=0;i<this.initialBubblePositions.length&&i<e;++i){const e=this.initialBubblePositions[i][0],s=this.initialBubblePositions[i][1],n=yield t().objects.Bubble.createInstance(1,e,s);n.behaviors.Physics.isEnabled=!1,n.width=400,n.height=400,this.bubbleList.push(n);const o=this.objectsList.splice(Math.floor(Math.random()*this.objectsList.length),1)[0];n.instVars.childObject=o;const c=yield t().objects[o].createInstance(1,e,s);c.width=300,c.height=300,c.instVars.name=o,c.behaviors.Physics.isEnabled=!1,this.createdObjectList.push(c),yield t().callFunction("attachObject",c.uid,n.uid),yield t().callFunction("setupBubblePhysics",n.uid)}this.objectsInitialized=!0}yield t().callFunction("initCrabPosition"),this.stickers.length&&(this.stickers.forEach((e=>s(this,void 0,void 0,(function*(){if(e){let i=yield t().objects[e.name].createInstance(0,500,500);i.width=e.width,i.height=e.height,console.log(i)}})))),this.stickers=[])}))}bubbleTapped(e){return s(this,void 0,void 0,(function*(){if(this.userCanPop){this.userCanPop=!1;const i=e.instVars.childObject;yield t().objects.bubblepopspritesheet.createInstance(1,0,-300),yield t().callFunction("popBubble",e.uid),yield t().callFunction("dropObject",i)}}))}launchCrab(){return s(this,void 0,void 0,(function*(){}))}intercept(e,i,n){return s(this,void 0,void 0,(function*(){let s=i.getImagePoint("crabloc"),n=e.x-s[0],o=e.y-(s[1]+600),c=Math.sqrt(n*n+o*o);yield t().callFunction("fireCrab",c,i.uid)}))}quad(t,e,i){var s=null;if(Math.abs(t)<1e-6)s=Math.abs(e)<1e-6?Math.abs(i)<1e-6?[0,0]:null:[-i/e,-i/e];else{var n=e*e-4*t*i;n>=0&&(s=[(-e-(n=Math.sqrt(n)))/(t*=2),(-e+n)/t])}return s}tick(){}}var o=function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function c(t){try{a(s.next(t))}catch(t){o(t)}}function l(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(c,l)}a((s=s.apply(t,e||[])).next())}))};class c{constructor(t){this.main=t,this.soundPlacementUIDMap={},this.initialized=!1,this.soundPages=null,this.objectMap=null,this.pageIndex=0,this.selectedSounds=[],this.selectedList=[],this.maxSelectedDisplay=13,this.xTextStartPosition=500,this.yTextStartPosition=350,this.marginTop=125,this.setupConstructCallbacks()}setupConstructCallbacks(){e().menu__init=()=>o(this,void 0,void 0,(function*(){return yield this.init()})),e().menu__toggle_pageUp=()=>o(this,void 0,void 0,(function*(){return yield this.pageDown()})),e().menu__toggle_pageDown=()=>o(this,void 0,void 0,(function*(){return yield this.pageUp()})),e().menu__toggle_button=t=>o(this,void 0,void 0,(function*(){return yield this.toggleButton(t)})),e().menu__toggle_placement=t=>o(this,void 0,void 0,(function*(){return yield this.togglePlacement(t)})),e().menu__select_sounds=()=>o(this,void 0,void 0,(function*(){this.main.setLoadSounds(this.selectedList),t().goToLayout("Main")}))}init(){return o(this,void 0,void 0,(function*(){if(!this.initialized){const e=yield t().assets.getProjectFileUrl("Menu.json"),i=yield t().assets.fetchJson(e),s=yield t().assets.getProjectFileUrl("Main.json"),n=yield t().assets.fetchJson(s);this.soundPages=i.pages,this.objectMap=n.objectMap,this.initialized=!0}yield this.setPage(this.pageIndex)}))}setPage(e){return o(this,void 0,void 0,(function*(){this.soundPlacementUIDMap={},t().objects.ItemText.getAllInstances().forEach((t=>{t.destroy()})),t().objects.Toggle.getAllInstances().forEach((t=>{t.destroy()})),t().objects.SoundBorder.getAllInstances().forEach((t=>{t.destroy()}));const i=this.soundPages[e];let s=this.xTextStartPosition;for(let e=0;e<i.columns.length;++e){const n=i.columns[e].sounds;let o=this.yTextStartPosition;for(let e=0;e<n.length;++e){e>0&&(o+=this.marginTop);let i=n[e];yield this.createText(i.sound,s+220,o+20,55,125,100),yield this.createToggle(i,s+165,o+65,60,60);const c=o;if("placement"in i){let t=s+380;for(let e=0;e<i.placement.length;++e){const s=yield this.createText(i.placement[e],t,o+40,35,225,60);s.isVisible=!1,this.selectedList.find((t=>t.sound===i.sound))&&(s.isVisible=!0),s.instVars.sound=i.sound,s.instVars.placement=i.placement[e],s.instVars.canToggle=1,this.selectedList.find((t=>t.sound===i.sound))&&(s.isVisible=!0),this.selectedList.find((t=>t.sound===i.sound&&t.placement===s.instVars.placement))&&(s.text="[color=#00857B]"+s.instVars.placement.toUpperCase()+"[/color]",s.isBold=!0),i.sound in this.soundPlacementUIDMap||(this.soundPlacementUIDMap[i.sound]=[]),this.soundPlacementUIDMap[i.sound].push(s.uid),t+=200}}if(o+="blends"in i?100:80,"blends"in i)for(let t=0;t<i.blends.length;++t){const e=i.blends[t];if(yield this.createToggle(e,s+185,o+55,50,50),yield this.createText(e.sound,s+230,o+20,40,135,100),"placement"in e){let t=s+380;for(let i=0;i<e.placement.length;++i){const s=yield this.createText(e.placement[i],t,o+20,35,225,60);s.isVisible=!1,s.instVars.sound=e.sound,s.instVars.placement=e.placement[i],s.instVars.canToggle=1,this.selectedList.find((t=>t.sound===e.sound))&&(s.isVisible=!0),this.selectedList.find((t=>t.sound===e.sound&&t.placement===s.instVars.placement))&&(s.text="[color=#00857B]"+s.instVars.placement.toUpperCase()+"[/color]",s.isBold=!0),e.sound in this.soundPlacementUIDMap||(this.soundPlacementUIDMap[e.sound]=[]),this.soundPlacementUIDMap[e.sound].push(s.uid),t+=200}}o+=70}const l=yield t().objects.SoundBorder.createInstance(1,s+100,c);l.height=10,l.width=900;const a=yield t().objects.SoundBorder.createInstance(1,s+100,c);a.height=o-c+40,a.width=10;const d=yield t().objects.SoundBorder.createInstance(1,s+100+890,c);d.height=o-c+40,d.width=10;const r=yield t().objects.SoundBorder.createInstance(1,s+100,o+40);r.height=10,r.width=900}e+1<i.columns.length&&(s+=975)}yield this.setupSelectedSounds()}))}setupSelectedSounds(){return o(this,void 0,void 0,(function*(){t().objects.SelectedText.getAllInstances().forEach((t=>{t.destroy()}));let e=this.xTextStartPosition+1950,i=this.yTextStartPosition;const s=yield t().objects.SoundBorder.createInstance(0,e+100,i);s.height=10,s.width=700;const n=yield t().objects.SoundBorder.createInstance(0,e+100,i+1300);n.height=10,n.width=700;const o=yield t().objects.SoundBorder.createInstance(0,e+100,i);o.height=1300,o.width=10;const c=yield t().objects.SoundBorder.createInstance(0,e+790,i);c.height=1300,c.width=10;const l=yield this.createText("",e+150,i+20,55,350,100);l.text="[color=#00857B]Sounds[/color]",l.isBold=!0,i+=130,this.selectedList.sort(((t,e)=>{if(t.sound===e.sound){if("initial"===t.placement)return-1;if("medial"===t.placement&&"initial"===e.placement)return 1;if("medial"===t.placement)return-1;if("final"===t.placement)return 1}return t.sound.localeCompare(e.sound)}));for(let t=0;t<this.selectedList.length&&t<this.maxSelectedDisplay;++t){let s=this.selectedList[t];yield this.createSelectedText(s.sound.toUpperCase(),e+150,i,50,350),s.placement&&(yield this.createSelectedText(this.capitalize(s.placement),e+300,i,50,350)),i+=80}this.selectedList.length>this.maxSelectedDisplay&&(yield this.createSelectedText("...",e+450,i,50,350))}))}createText(e,i,s,n,c,l){return o(this,void 0,void 0,(function*(){const o=yield t().objects.ItemText.createInstance(0,i,s);return o.text="[color=#703c4d]"+e.toUpperCase()+"[/color]",o.fontFace="sofiapro-bold",o.sizePt=n,o.width=c,o.height=l,o}))}createSelectedText(e,i,s,n,c){return o(this,void 0,void 0,(function*(){const o=yield t().objects.SelectedText.createInstance(0,i,s);return o.text="[color=#00857B]"+e+"[/color]",o.fontFace="sofiapro-bold",o.sizePt=n,o.width=c,o.height=100,o}))}capitalize(t){return"string"!=typeof t?"":t.charAt(0).toUpperCase()+t.slice(1)}createToggle(e,i,s,n,c){return o(this,void 0,void 0,(function*(){const o=yield t().objects.Toggle.createInstance(0,i,s);return o.width=n,o.height=c,o.instVars.sound=e.sound,this.selectedList.find((t=>t.sound===e.sound))&&(o.animationFrame=1),o}))}getSelectedSoundObjects(){return o(this,void 0,void 0,(function*(){return[]}))}pageUp(){return o(this,void 0,void 0,(function*(){this.pageIndex++,this.pageIndex>=this.soundPages.length&&(this.pageIndex=0),this.setPage(this.pageIndex)}))}pageDown(){return o(this,void 0,void 0,(function*(){this.pageIndex--,this.pageIndex<0&&(this.pageIndex=this.soundPages.length-1),this.setPage(this.pageIndex)}))}toggleButton(e){return o(this,void 0,void 0,(function*(){0===e.animationFrame?e.animationFrame=1:e.animationFrame=0;const i=this.soundPlacementUIDMap[e.instVars.sound];i&&i.forEach((i=>{const s=t().getInstanceByUid(i);s.isVisible=1===e.animationFrame,s.isVisible||(s.text="[color=#703c4d]"+s.instVars.placement.toUpperCase()+"[/color]",s.isBold=!1)}));let s=!1;const n=e.instVars.sound;for(let t=this.selectedList.length-1;t>=0;--t)this.selectedList[t].sound===n&&0===e.animationFrame&&(this.selectedList.splice(t,1),s=!0);s||1!==e.animationFrame||this.selectedList.push({sound:n}),yield this.setupSelectedSounds()}))}togglePlacement(t){return o(this,void 0,void 0,(function*(){const e=t.instVars.placement,i=t.instVars.sound;0==t.isBold?(t.text="[color=#00857B]"+e.toUpperCase()+"[/color]",t.isBold=!0):(t.text="[color=#703c4d]"+e.toUpperCase()+"[/color]",t.isBold=!1);for(let s=this.selectedList.length-1;s>=0;--s){const n=this.selectedList[s];if(n.sound!==i);else{if(t.isBold){n.placement?this.selectedList.push({sound:i,placement:e}):n.placement=e;break}if(n.placement===e){delete n.placement;for(let t=this.selectedList.length-1;t>=0;--t){let e=this.selectedList[t];if(e.sound===i&&e.placement){this.selectedList.splice(s,1);break}}break}}}this.setupSelectedSounds()}))}}var l=function(t,e,i,s){return new(i||(i=Promise))((function(n,o){function c(t){try{a(s.next(t))}catch(t){o(t)}}function l(t){try{a(s.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(c,l)}a((s=s.apply(t,e||[])).next())}))};class a{constructor(t){this.main=t,this.initialized=!1,this.storeObjects=null,this.setupConstructCallbacks()}setupConstructCallbacks(){e().store__init=()=>l(this,void 0,void 0,(function*(){return yield this.init()})),e().store__buttonClicked=t=>l(this,void 0,void 0,(function*(){return yield this.buttonClicked(t)})),e().store__backButtonClicked=()=>l(this,void 0,void 0,(function*(){return yield this.backToMain()}))}init(){return l(this,void 0,void 0,(function*(){if(!this.initialized){const i=yield t().assets.getProjectFileUrl("Store.json"),s=yield t().assets.fetchJson(i);console.log(t()),console.log(e()),this.storeObjects=s.objects,this.initialized=!0}yield this.setupPage()}))}setupPage(){return l(this,void 0,void 0,(function*(){console.log(this.storeObjects),console.log(t().objects);for(let e=0;e<this.storeObjects.length;++e){const i=this.storeObjects[e].name,s=this.storeObjects[e].cost,n=850+e%5*550,o=560+780*Math.floor(e/5),c=yield t().objects[i].createInstance(0,n,o);c.width=450,c.height=450;const l=850+e%5*550,a=880+780*Math.floor(e/5),d=yield t().objects.woodButton.createInstance(0,l,a);d.width=385,d.height=135;const r=785+e%5*550,h=885+780*Math.floor(e/5),u=yield t().objects.coin.createInstance(0,r,h);u.width=100,u.height=100;const b=835+e%5*550,p=830+780*Math.floor(e/5),f=yield t().objects.CostText.createInstance(0,b,p);f.text=t().globalVars.score>=s?"[color=#00ff00]"+s+"[/color]":"[color=#ff0000]"+s+"[/color]",f.fontFace="sofiapro-bold",f.sizePt=60,yield t().callFunction("setupSticker",c.uid),d.instVars={},d.instVars.name=i}}))}buttonClicked(e){return l(this,void 0,void 0,(function*(){const i=this.storeObjects.find((t=>t.name===e.instVars.name));t().globalVars.score>=i.cost&&(this.main.addSticker(i),t().globalVars.score-=i.cost,t().goToLayout("Main"))}))}backToMain(){return l(this,void 0,void 0,(function*(){this.main.addSticker(null),t().goToLayout("Main")}))}}class d{constructor(t,e){i.getInstance().setRuntime(t),i.getInstance().setGlobalThis(e),this.main=new n,this.menu=new c(this.main),this.store=new a(this.main)}}!function(){runOnStartup((t=>{return e=this,i=void 0,n=function*(){new d(t,globalThis)},new((s=void 0)||(s=Promise))((function(t,o){function c(t){try{a(n.next(t))}catch(t){o(t)}}function l(t){try{a(n.throw(t))}catch(t){o(t)}}function a(e){var i;e.done?t(e.value):(i=e.value,i instanceof s?i:new s((function(t){t(i)}))).then(c,l)}a((n=n.apply(e,i||[])).next())}));var e,i,s,n}))}()})();