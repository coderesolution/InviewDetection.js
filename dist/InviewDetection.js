function t(){return t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},t.apply(this,arguments)}module.exports=/*#__PURE__*/function(){function e(e){void 0===e&&(e={}),this.defaultOptions={elements:"[data-inview]",duration:1,delay:.4,start:"top 90%",ease:"power4",stagger:.095,animationFrom:{opacity:0,"will-change":"transform",y:20},animationTo:{opacity:1,y:0}},this.options=t({},this.defaultOptions,e),this.triggers=[],this.init()}var r=e.prototype;return r.getOption=function(t){return this.options[t]},r.init=function(){var t=this;try{gsap.utils.toArray(this.getOption("elements")).forEach(function(e,r){var n=[];e.hasAttribute("data-inview-scope")?(t.addScopedElements(e,n),t.addChildElements(e,n),t.addSplitElements(e,n)):n.push({el:e,order:e.dataset.inviewOrder}),t.orderAnimatedElements(n),t.animateElements(e,n,r)})}catch(t){console.error("Error initialising InviewDetection:",t)}},r.addScopedElements=function(t,e){try{t.dataset.inviewScope&&t.querySelectorAll(":scope "+t.dataset.inviewScope).forEach(function(t){var r=parseFloat(t.dataset.inviewOrder);e.push({el:t,order:r})})}catch(t){console.error("Error adding scoped elements:",t)}},r.addChildElements=function(t,e){try{t.querySelectorAll(":scope [data-inview-child]").forEach(function(t){var r=parseFloat(t.dataset.inviewOrder);e.push({el:t,order:r})})}catch(t){console.error("Error adding child elements:",t)}},r.findClosestParentOrderAttr=function(t){for(var e=t.parentElement,r=0;e&&r<=5;){if(e.hasAttribute("data-inview-order"))return parseFloat(e.getAttribute("data-inview-order"));e=e.parentElement,r++}if(t.hasAttribute("data-inview-order")){var n=t.getAttribute("data-inview-order");return!isNaN(+n)&&+n}return!1},r.addSplitElements=function(t,e){var r=this,n=t.querySelectorAll(":scope *:where([data-inview-split])"),i=Array.from(n).filter(function(t){return t.dataset.inviewSplit}),a=Array.from(n).filter(function(t){return!t.dataset.inviewSplit});[].concat(a,this.getSplitChildren(i)).forEach(function(t){return r.addSplitElement(t,e)})},r.getSplitChildren=function(t){var e=[];return t.forEach(function(t){e=[].concat(e,t.querySelectorAll(":scope "+t.dataset.inviewSplit))}),e},r.addSplitElement=function(t,e){try{var r=this.findClosestParentOrderAttr(t);new SplitText(t,{type:"lines",linesClass:"lineChild"}).lines.forEach(function(t){r?(t.dataset.inviewOrder=(r+=.01).toFixed(2),e.push({el:t,order:r})):e.push({el:t,order:!1})})}catch(t){console.error("Error splitting element:",t)}},r.orderAnimatedElements=function(t){t.sort(function(t,e){var r,n;return(null!=(r=t.order)?r:1)-(null!=(n=e.order)?n:-1)});for(var e=0;e<t.length;e++)t[e]=t[e].el},r.animateElements=function(t,e,r){var n=this,i=this,a=this.getOption("animationFrom"),o=this.getOption("animationTo");try{t.dataset.inviewFrom&&(a=JSON.parse(t.dataset.inviewFrom)),t.dataset.inviewTo&&(o=JSON.parse(t.dataset.inviewTo))}catch(t){console.error("Error parsing JSON",t)}gsap.set(e,a);var s=ScrollTrigger.create({trigger:t,start:t.dataset.inviewStart||this.getOption("start"),onEnter:function(){try{return Promise.resolve(n.runAnimation(t,e,o)).then(function(){})}catch(t){return Promise.reject(t)}},onEnterBack:function(){try{var r=function(){if(t.hasAttribute("data-inview-repeat"))return gsap.set(e,a),Promise.resolve(i.runAnimation(t,e,o)).then(function(){})}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},onLeave:function(){t.hasAttribute("data-inview-repeat")&&gsap.set(e,a)},onLeaveBack:function(){t.hasAttribute("data-inview-repeat")&&gsap.set(e,a)},markers:!!t.hasAttribute("data-inview-debug"),toggleClass:{targets:t,className:"is-inview"}});this.triggers.push(s),t.hasAttribute("data-inview-debug")&&this.debugMode(t,e,a,o,r)},r.runAnimation=function(e,r,n){try{var i=this,a=function(a,o){try{var s=Promise.resolve(gsap.to(r,t({},n,{duration:e.dataset.inviewDuration||i.getOption("duration"),delay:e.dataset.inviewDelay||i.getOption("delay"),ease:e.dataset.inviewEase||i.getOption("ease"),stagger:{each:e.dataset.inviewStagger||i.getOption("stagger"),from:"start"}}))).then(function(){e.classList.add("has-viewed")})}catch(t){return o(t)}return s&&s.then?s.then(void 0,o):s}(0,function(t){console.error("Error animating elements:",t)});return Promise.resolve(a&&a.then?a.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},r.debugMode=function(t,e,r,n,i){console.group("InviewDetection() debug instance ("+(i+1)+")"),console.log({parent:t,elements:e,animationFrom:r,animationTo:n,duration:this.getOption("duration"),delay:this.getOption("delay"),start:this.getOption("start"),ease:this.getOption("ease"),stagger:this.getOption("stagger")}),console.groupEnd()},r.refresh=function(){ScrollTrigger.refresh()},r.stop=function(){this.triggers.forEach(function(t){return t.kill()}),gsap.utils.toArray(this.getOption("elements")).forEach(function(t){gsap.killTweensOf(t)})},r.restart=function(){gsap.utils.toArray(this.getOption("elements")).forEach(function(t){gsap.killTweensOf(t)}),this.init()},e}();
//# sourceMappingURL=InviewDetection.js.map
