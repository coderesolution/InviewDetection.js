function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},e.apply(this,arguments)}var t=/*#__PURE__*/function(){function t(t){void 0===t&&(t={}),this.defaultOptions={elements:"[data-inview]",duration:1,delay:.4,start:"top 90%",ease:"power4",stagger:.095,animationFrom:{opacity:0,"will-change":"transform",y:20},animationTo:{opacity:1,y:0},screen:"(min-width: 768px)"},this.options=e({},this.defaultOptions,t),this.triggers=[],this.animatedElements=[],this.init()}var i=t.prototype;return i.getOption=function(e){return this.options[e]},i.init=function(){var e=this;try{gsap.utils.toArray(this.getOption("elements")).forEach(function(t,i){var n=[];t.hasAttribute("data-inview-scope")?(e.addScopedElements(t,n),e.addChildElements(t,n),e.addSplitElements(t,n)):n.push({el:t,order:t.dataset.inviewOrder}),e.orderAnimatedElements(n),e.getOption("animationFrom"),t.dataset.inviewFrom&&JSON.parse(t.dataset.inviewFrom),e.animateElements(t,n,i)})}catch(e){console.error("Error initialising InviewDetection:",e)}},i.addScopedElements=function(e,t){var i=this;try{e.dataset.inviewScope&&e.querySelectorAll(":scope "+e.dataset.inviewScope).forEach(function(e){var n=parseFloat(e.dataset.inviewOrder);t.push({el:e,order:n}),i.animatedElements.push(e)})}catch(e){console.error("Error adding scoped elements:",e)}},i.addChildElements=function(e,t){var i=this;try{e.querySelectorAll(":scope [data-inview-child]").forEach(function(e){var n=parseFloat(e.dataset.inviewOrder);t.push({el:e,order:n}),i.animatedElements.push(e)})}catch(e){console.error("Error adding child elements:",e)}},i.findClosestParentOrderAttr=function(e){for(var t=e.parentElement,i=0;t&&i<=5;){if(t.hasAttribute("data-inview-order"))return parseFloat(t.getAttribute("data-inview-order"));t=t.parentElement,i++}if(e.hasAttribute("data-inview-order")){var n=e.getAttribute("data-inview-order");return!isNaN(+n)&&+n}return!1},i.addSplitElements=function(e,t){var i=this,n=e.querySelectorAll(":scope *:where([data-inview-split])"),a=Array.from(n).filter(function(e){return e.dataset.inviewSplit}),r=Array.from(n).filter(function(e){return!e.dataset.inviewSplit});[].concat(r,this.getSplitChildren(a)).forEach(function(e){e instanceof NodeList?e.forEach(function(e){return i.addSplitElement(e,t)}):i.addSplitElement(e,t)})},i.getSplitChildren=function(e){var t=[];return e.forEach(function(e){t=[].concat(t,e.querySelectorAll(":scope "+e.dataset.inviewSplit))}),t},i.addSplitElement=function(e,t){var i=this;try{if(e instanceof Element){var n=this.findClosestParentOrderAttr(e);new SplitText(e,{type:"lines",linesClass:"lineChild"}).lines.forEach(function(e){n?(e.dataset.inviewOrder=(n+=.01).toFixed(2),t.push({el:e,order:n}),i.animatedElements.push(e)):(t.push({el:e,order:!1}),i.animatedElements.push(e))})}else console.error("splitElement is not a DOM element:",e)}catch(e){console.error("Error splitting element:",e)}},i.orderAnimatedElements=function(e){e.sort(function(e,t){var i,n;return(null!=(i=e.order)?i:1)-(null!=(n=t.order)?n:-1)});for(var t=0;t<e.length;t++)e[t]=e[t].el},i.animateElements=function(t,i,n){var a=this,r=[],o=[],s=gsap.matchMedia(),l=t.dataset.inviewScreen||this.getOption("screen");s.add(l,function(){var n=gsap.timeline({scrollTrigger:{trigger:t,start:t.dataset.inviewStart||a.getOption("start"),invalidateOnRefresh:!0,onEnter:function(){try{return n.play(),n.hasPlayed=!0,Promise.resolve()}catch(e){return Promise.reject(e)}},onEnterBack:function(){try{return t.hasAttribute("data-inview-repeat")?(n.restart(),n.hasPlayed=!0):n.hasPlayed||(n.play(),n.hasPlayed=!0),Promise.resolve()}catch(e){return Promise.reject(e)}},onLeave:function(){t.hasAttribute("data-inview-repeat")&&n.restart().pause()},onLeaveBack:function(){t.hasAttribute("data-inview-repeat")&&n.restart().pause()},markers:!!t.hasAttribute("data-inview-debug"),toggleClass:{targets:t,className:"is-inview"}}});n.hasPlayed=!1;var s=0;i.forEach(function(i){try{var l=a.getOption("animationFrom"),d=a.getOption("animationTo");i.dataset.inviewFrom?l=JSON.parse(i.dataset.inviewFrom):t.dataset.inviewFrom&&(l=JSON.parse(t.dataset.inviewFrom)),i.dataset.inviewTo?d=JSON.parse(i.dataset.inviewTo):t.dataset.inviewTo&&(d=JSON.parse(t.dataset.inviewTo)),r.push(l),o.push(d),gsap.set(i,l);var c=t.dataset.inviewStagger||a.getOption("stagger");n.to(i,e({},d,{duration:t.dataset.inviewDuration||a.getOption("duration"),delay:t.dataset.inviewDelay||a.getOption("delay"),ease:t.dataset.inviewEase||a.getOption("ease")}),s),s+=parseFloat(c)}catch(e){console.error("An error occurred while animating the element: "+e)}}),n.pause()}),t.hasAttribute("data-inview-debug")&&this.debugMode(t,i,r,o,n)},i.debugMode=function(e,t,i,n,a){console.group("InviewDetection() debug instance ("+(a+1)+")"),console.log({parent:e,elements:t,screen:this.getOption("screen"),animationFrom:i,animationTo:n,duration:this.getOption("duration"),delay:this.getOption("delay"),start:this.getOption("start"),ease:this.getOption("ease"),stagger:this.getOption("stagger")}),console.groupEnd()},i.refresh=function(){ScrollTrigger.refresh()},i.stop=function(){this.triggers.forEach(function(e){return e.kill()}),gsap.utils.toArray(this.getOption("elements")).concat(this.animatedElements).forEach(function(e){gsap.killTweensOf(e)})},i.restart=function(){gsap.utils.toArray(this.getOption("elements")).forEach(function(e){gsap.killTweensOf(e)}),this.init()},t}();export{t as default};
//# sourceMappingURL=InviewDetection.mjs.map
