function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r])}return t},t.apply(this,arguments)}var e=/*#__PURE__*/function(){function e(e){void 0===e&&(e={}),this.defaultOptions={elements:"[data-inview]",duration:1,delay:.4,start:"top 90%",ease:"power4",stagger:.095,animationFrom:{opacity:0,"will-change":"transform",y:20},animationTo:{opacity:1,y:0},screen:"(min-width: 1025px)",autoStart:!0,registerGsap:!1},this.options=t({},this.defaultOptions,e),this.triggers=[],this.animatedElements=[],this.getOption("autoStart")&&this.init()}var i=e.prototype;return i.getOption=function(t){return this.options[t]},i.init=function(){var t=this;try{this.getOption("registerGsap")&&this.registerGsap(),gsap.utils.toArray(this.getOption("elements")).forEach(function(e,i){var r=[];e.hasAttribute("data-inview-scope")?(t.addScopedElements(e,r),t.addChildElements(e,r),t.addSplitElements(e,r)):r.push({el:e,order:e.dataset.inviewOrder}),t.orderAnimatedElements(r),t.getOption("animationFrom"),e.dataset.inviewFrom&&JSON.parse(e.dataset.inviewFrom),t.animateElements(e,r,i)})}catch(t){console.error("Error initialising InviewDetection:",t)}},i.registerGsap=function(){return new Promise(function(t,e){try{gsap.registerPlugin(ScrollTrigger,SplitText),t()}catch(t){e(t)}})},i.start=function(){this.init()},i.addScopedElements=function(t,e){var i=this;try{t.dataset.inviewScope&&t.querySelectorAll(":scope "+t.dataset.inviewScope).forEach(function(t){var r=parseFloat(t.dataset.inviewOrder);e.push({el:t,order:r}),i.animatedElements.push(t)})}catch(t){console.error("Error adding scoped elements:",t)}},i.addChildElements=function(t,e){var i=this;try{t.querySelectorAll(":scope [data-inview-child]").forEach(function(t){var r=parseFloat(t.dataset.inviewOrder);e.push({el:t,order:r}),i.animatedElements.push(t)})}catch(t){console.error("Error adding child elements:",t)}},i.findClosestParentOrderAttr=function(t){for(var e=t.parentElement,i=0;e&&i<=5;){if(e.hasAttribute("data-inview-order"))return parseFloat(e.getAttribute("data-inview-order"));e=e.parentElement,i++}if(t.hasAttribute("data-inview-order")){var r=t.getAttribute("data-inview-order");return!isNaN(+r)&&+r}return!1},i.addSplitElements=function(t,e){var i=this,r=t.querySelectorAll(":scope *:where([data-inview-split])"),n=Array.from(r).filter(function(t){return t.dataset.inviewSplit}),a=Array.from(r).filter(function(t){return!t.dataset.inviewSplit});[].concat(a,this.getSplitChildren(n)).forEach(function(t){t instanceof NodeList?t.forEach(function(t){return i.addSplitElement(t,e)}):i.addSplitElement(t,e)})},i.getSplitChildren=function(t){var e=[];return t.forEach(function(t){e=[].concat(e,t.querySelectorAll(":scope "+t.dataset.inviewSplit))}),e},i.addSplitElement=function(t,e){var i=this;try{if(t instanceof Element){var r=this.findClosestParentOrderAttr(t);new SplitText(t,{type:"lines",linesClass:"lineChild"}).lines.forEach(function(t){r?(t.dataset.inviewOrder=(r+=.01).toFixed(2),e.push({el:t,order:r}),i.animatedElements.push(t)):(e.push({el:t,order:!1}),i.animatedElements.push(t)),t.style.visibility="visible"})}else console.error("splitElement is not a DOM element:",t)}catch(t){console.error("Error splitting element:",t)}},i.orderAnimatedElements=function(t){t.sort(function(t,e){var i,r;return(null!=(i=t.order)?i:1)-(null!=(r=e.order)?r:-1)});for(var e=0;e<t.length;e++)t[e]=t[e].el},i.animateElements=function(e,i,r){var n=this,a=[],s=[],o=gsap.matchMedia(),l=e.dataset.inviewScreen||this.getOption("screen");o.add(l,function(){var r=gsap.timeline({scrollTrigger:{trigger:e,start:e.dataset.inviewStart||n.getOption("start"),invalidateOnRefresh:!0,onEnter:function(){try{return r.play(),r.hasPlayed=!0,Promise.resolve()}catch(t){return Promise.reject(t)}},onEnterBack:function(){try{return e.hasAttribute("data-inview-repeat")?(r.restart(),r.hasPlayed=!0):r.hasPlayed||(r.play(),r.hasPlayed=!0),Promise.resolve()}catch(t){return Promise.reject(t)}},onLeave:function(){e.hasAttribute("data-inview-repeat")&&r.restart().pause()},onLeaveBack:function(){e.hasAttribute("data-inview-repeat")&&r.restart().pause()},markers:!!e.hasAttribute("data-inview-debug"),toggleClass:{targets:e,className:"is-inview"}}});r.hasPlayed=!1;var o=0;i.forEach(function(i){try{var l=n.getOption("animationFrom"),d=n.getOption("animationTo");i.dataset.inviewFrom?l=JSON.parse(i.dataset.inviewFrom):e.dataset.inviewFrom&&(l=JSON.parse(e.dataset.inviewFrom)),i.dataset.inviewTo?d=JSON.parse(i.dataset.inviewTo):e.dataset.inviewTo&&(d=JSON.parse(e.dataset.inviewTo)),a.push(l),s.push(d),gsap.set(i,l);var c=e.dataset.inviewStagger||n.getOption("stagger");r.to(i,t({},d,{duration:e.dataset.inviewDuration||n.getOption("duration"),delay:e.dataset.inviewDelay||n.getOption("delay"),ease:e.dataset.inviewEase||n.getOption("ease")}),o),o+=parseFloat(c)}catch(t){console.error("An error occurred while animating the element: "+t)}}),r.pause()}),e.hasAttribute("data-inview-debug")&&this.debugMode(e,i,a,s,r)},i.debugMode=function(t,e,i,r,n){console.group("InviewDetection() debug instance (#"+(n+1)+")"),console.log({parent:t,elements:e,screen:this.getOption("screen"),animationFrom:i,animationTo:r,duration:this.getOption("duration"),delay:this.getOption("delay"),start:this.getOption("start"),ease:this.getOption("ease"),stagger:this.getOption("stagger")}),console.groupEnd()},i.refresh=function(){ScrollTrigger.refresh()},i.stop=function(){this.triggers.forEach(function(t){return t.kill()}),gsap.utils.toArray(this.getOption("elements")).concat(this.animatedElements).forEach(function(t){gsap.killTweensOf(t)})},i.restart=function(){gsap.utils.toArray(this.getOption("elements")).forEach(function(t){gsap.killTweensOf(t)}),this.init()},e}();export{e as default};
//# sourceMappingURL=InviewDetection.mjs.map
