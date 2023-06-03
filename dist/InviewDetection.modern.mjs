function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a])}return e},e.apply(this,arguments)}class t{constructor(t={}){this.defaultOptions={elements:"[data-inview]",duration:1,delay:.4,start:"top 90%",ease:"power4",stagger:.095,animationFrom:{opacity:0,"will-change":"transform",y:20},animationTo:{opacity:1,y:0},screen:"(min-width: 768px)"},this.options=e({},this.defaultOptions,t),this.triggers=[],this.animatedElements=[],this.init()}getOption(e){return this.options[e]}init(){try{gsap.utils.toArray(this.getOption("elements")).forEach((e,t)=>{let i=[];e.hasAttribute("data-inview-scope")?(this.addScopedElements(e,i),this.addChildElements(e,i),this.addSplitElements(e,i)):i.push({el:e,order:e.dataset.inviewOrder}),this.orderAnimatedElements(i);let a=this.getOption("animationFrom");e.dataset.inviewFrom&&(a=JSON.parse(e.dataset.inviewFrom)),this.animateElements(e,i,t)})}catch(e){console.error("Error initialising InviewDetection:",e)}}addScopedElements(e,t){try{e.dataset.inviewScope&&e.querySelectorAll(":scope "+e.dataset.inviewScope).forEach(e=>{const i=parseFloat(e.dataset.inviewOrder);t.push({el:e,order:i}),this.animatedElements.push(e)})}catch(e){console.error("Error adding scoped elements:",e)}}addChildElements(e,t){try{e.querySelectorAll(":scope [data-inview-child]").forEach(e=>{const i=parseFloat(e.dataset.inviewOrder);t.push({el:e,order:i}),this.animatedElements.push(e)})}catch(e){console.error("Error adding child elements:",e)}}findClosestParentOrderAttr(e){let t=e.parentElement,i=0;for(;t&&i<=5;){if(t.hasAttribute("data-inview-order"))return parseFloat(t.getAttribute("data-inview-order"));t=t.parentElement,i++}if(e.hasAttribute("data-inview-order")){const t=e.getAttribute("data-inview-order");return!isNaN(+t)&&+t}return!1}addSplitElements(e,t){const i=e.querySelectorAll(":scope *:where([data-inview-split])"),a=Array.from(i).filter(e=>e.dataset.inviewSplit);[...Array.from(i).filter(e=>!e.dataset.inviewSplit),...this.getSplitChildren(a)].forEach(e=>{e instanceof NodeList?e.forEach(e=>this.addSplitElement(e,t)):this.addSplitElement(e,t)})}getSplitChildren(e){let t=[];return e.forEach(e=>{t=[...t,...e.querySelectorAll(":scope "+e.dataset.inviewSplit)]}),t}addSplitElement(e,t){try{if(e instanceof Element){let i=this.findClosestParentOrderAttr(e);new SplitText(e,{type:"lines",linesClass:"lineChild"}).lines.forEach(e=>{i?(i+=.01,e.dataset.inviewOrder=i.toFixed(2),t.push({el:e,order:i}),this.animatedElements.push(e)):(t.push({el:e,order:!1}),this.animatedElements.push(e))})}else console.error("splitElement is not a DOM element:",e)}catch(e){console.error("Error splitting element:",e)}}orderAnimatedElements(e){e.sort((e,t)=>{var i,a;return(null!=(i=e.order)?i:1)-(null!=(a=t.order)?a:-1)});for(let t=0;t<e.length;t++)e[t]=e[t].el}animateElements(t,i,a){let r=[],s=[];const n=gsap.matchMedia(),o=t.dataset.inviewScreen||this.getOption("screen");n.add(o,()=>{let a=gsap.timeline({scrollTrigger:{trigger:t,start:t.dataset.inviewStart||this.getOption("start"),invalidateOnRefresh:!0,onEnter:async function(){a.play(),a.hasPlayed=!0},onEnterBack:async function(){t.hasAttribute("data-inview-repeat")?(a.restart(),a.hasPlayed=!0):a.hasPlayed||(a.play(),a.hasPlayed=!0)},onLeave:()=>{t.hasAttribute("data-inview-repeat")&&a.restart().pause()},onLeaveBack:()=>{t.hasAttribute("data-inview-repeat")&&a.restart().pause()},markers:!!t.hasAttribute("data-inview-debug"),toggleClass:{targets:t,className:"is-inview"}}});a.hasPlayed=!1;let n=0;i.forEach(i=>{try{let o=this.getOption("animationFrom"),l=this.getOption("animationTo");i.dataset.inviewFrom?o=JSON.parse(i.dataset.inviewFrom):t.dataset.inviewFrom&&(o=JSON.parse(t.dataset.inviewFrom)),i.dataset.inviewTo?l=JSON.parse(i.dataset.inviewTo):t.dataset.inviewTo&&(l=JSON.parse(t.dataset.inviewTo)),r.push(o),s.push(l),gsap.set(i,o);let d=t.dataset.inviewStagger||this.getOption("stagger");a.to(i,e({},l,{duration:t.dataset.inviewDuration||this.getOption("duration"),delay:t.dataset.inviewDelay||this.getOption("delay"),ease:t.dataset.inviewEase||this.getOption("ease")}),n),n+=parseFloat(d)}catch(e){console.error(`An error occurred while animating the element: ${e}`)}}),a.pause()}),t.hasAttribute("data-inview-debug")&&this.debugMode(t,i,r,s,a)}debugMode(e,t,i,a,r){console.group(`InviewDetection() debug instance (#${r+1})`),console.log({parent:e,elements:t,screen:this.getOption("screen"),animationFrom:i,animationTo:a,duration:this.getOption("duration"),delay:this.getOption("delay"),start:this.getOption("start"),ease:this.getOption("ease"),stagger:this.getOption("stagger")}),console.groupEnd()}refresh(){ScrollTrigger.refresh()}stop(){this.triggers.forEach(e=>e.kill()),gsap.utils.toArray(this.getOption("elements")).concat(this.animatedElements).forEach(e=>{gsap.killTweensOf(e)})}restart(){gsap.utils.toArray(this.getOption("elements")).forEach(e=>{gsap.killTweensOf(e)}),this.init()}}export{t as default};
//# sourceMappingURL=InviewDetection.modern.mjs.map
