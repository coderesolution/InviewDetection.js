!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t||self).inviewdetection=e()}(this,function(){function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t},t.apply(this,arguments)}/*#__PURE__*/
return function(){function e(e){void 0===e&&(e={}),this.defaultOptions={elements:"[data-inview]",duration:1,delay:.4,start:"top 90%",ease:"power4",stagger:.095,animationFrom:{opacity:0,"will-change":"transform",y:20},animationTo:{opacity:1,y:0}},this.options=t({},this.defaultOptions,e),this.triggers=[],this.init()}var i=e.prototype;return i.getOption=function(t){return this.options[t]},i.init=function(){var t=this;try{gsap.utils.toArray(this.getOption("elements")).forEach(function(e,i){var n=[];e.hasAttribute("data-inview-scope")?(t.addScopedElements(e,n),t.addChildElements(e,n),t.addSplitElements(e,n)):n.push({el:e,order:e.dataset.inviewOrder}),t.orderAnimatedElements(n),t.animateElements(e,n,i)})}catch(t){console.error("Error initialising InviewDetection:",t)}},i.addScopedElements=function(t,e){try{t.dataset.inviewScope&&t.querySelectorAll(":scope "+t.dataset.inviewScope).forEach(function(t){var i=parseFloat(t.dataset.inviewOrder);e.push({el:t,order:i})})}catch(t){console.error("Error adding scoped elements:",t)}},i.addChildElements=function(t,e){try{t.querySelectorAll(":scope [data-inview-child]").forEach(function(t){var i=parseFloat(t.dataset.inviewOrder);e.push({el:t,order:i})})}catch(t){console.error("Error adding child elements:",t)}},i.findClosestParentOrderAttr=function(t){for(var e=t.parentElement,i=0;e&&i<=5;){if(e.hasAttribute("data-inview-order"))return parseFloat(e.getAttribute("data-inview-order"));e=e.parentElement,i++}if(t.hasAttribute("data-inview-order")){var n=t.getAttribute("data-inview-order");return!isNaN(+n)&&+n}return!1},i.addSplitElements=function(t,e){var i=this,n=t.querySelectorAll(":scope *:where([data-inview-split])"),r=Array.from(n).filter(function(t){return t.dataset.inviewSplit}),a=Array.from(n).filter(function(t){return!t.dataset.inviewSplit});[].concat(a,this.getSplitChildren(r)).forEach(function(t){return i.addSplitElement(t,e)})},i.getSplitChildren=function(t){var e=[];return t.forEach(function(t){e=[].concat(e,t.querySelectorAll(":scope "+t.dataset.inviewSplit))}),e},i.addSplitElement=function(t,e){try{var i=this.findClosestParentOrderAttr(t);new SplitText(t,{type:"lines",linesClass:"lineChild"}).lines.forEach(function(t){i?(t.dataset.inviewOrder=(i+=.01).toFixed(2),e.push({el:t,order:i})):e.push({el:t,order:!1})})}catch(t){console.error("Error splitting element:",t)}},i.orderAnimatedElements=function(t){t.sort(function(t,e){var i,n;return(null!=(i=t.order)?i:1)-(null!=(n=e.order)?n:-1)});for(var e=0;e<t.length;e++)t[e]=t[e].el},i.animateElements=function(e,i,n){var r=this,a=this.getOption("animationFrom"),o=this.getOption("animationTo");try{e.dataset.inviewFrom&&(a=JSON.parse(e.dataset.inviewFrom)),e.dataset.inviewTo&&(o=JSON.parse(e.dataset.inviewTo))}catch(t){console.error("Error parsing JSON",t)}gsap.set(i,a);var s=ScrollTrigger.create({trigger:e,start:e.dataset.inviewStart||this.getOption("start"),onEnter:function(){gsap.to(i,t({},o,{duration:e.dataset.inviewDuration||r.getOption("duration"),delay:e.dataset.inviewDelay||r.getOption("delay"),ease:e.dataset.inviewEase||r.getOption("ease"),stagger:{each:e.dataset.inviewStagger||r.getOption("stagger"),from:"start"}})),e.classList.add("has-viewed")},markers:!!e.hasAttribute("data-inview-debug"),toggleClass:{targets:e,className:"is-inview"}});this.triggers.push(s),e.hasAttribute("data-inview-debug")&&this.debugMode(e,i,a,o,n)},i.debugMode=function(t,e,i,n,r){console.group("InviewDetection() debug instance ("+(r+1)+")"),console.log({parent:t,elements:e,animationFrom:i,animationTo:n,duration:this.getOption("duration"),delay:this.getOption("delay"),start:this.getOption("start"),ease:this.getOption("ease"),stagger:this.getOption("stagger")}),console.groupEnd()},i.refresh=function(){ScrollTrigger.refresh()},i.stop=function(){this.triggers.forEach(function(t){return t.kill()}),gsap.utils.toArray(this.getOption("elements")).forEach(function(t){gsap.killTweensOf(t)})},i.restart=function(){gsap.utils.toArray(this.getOption("elements")).forEach(function(t){gsap.killTweensOf(t)}),this.init()},e}()});
//# sourceMappingURL=InviewDetection.umd.js.map
