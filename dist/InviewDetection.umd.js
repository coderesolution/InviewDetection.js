!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e||self).inviewdetection=t()}(this,function(){function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},e.apply(this,arguments)}/*#__PURE__*/
return function(){function t(e){void 0===e&&(e={}),this.elements=e.elements||"[data-inview]",this.duration=e.duration||1,this.delay=e.delay||1,this.start=e.start||"top 90%",this.ease=e.ease||"power4",this.stagger=e.stagger||.155,this.init()}return t.prototype.init=function(){var t=this;gsap.utils.toArray(this.elements).forEach(function(r){var a=[];if(r.hasAttribute("data-inview-scope")){if(r.dataset.inviewScope&&r.querySelectorAll(":scope "+r.dataset.inviewScope).forEach(function(e){var t=parseFloat(e.dataset.inviewOrder);a.push({el:e,order:t})}),r.querySelectorAll(":scope [data-inview-child]")&&r.querySelectorAll(":scope [data-inview-child]").forEach(function(e){var t=parseFloat(e.dataset.inviewOrder);a.push({el:e,order:t})}),r.querySelectorAll(":scope *:where([data-inview-split])")){var i=[],n=r.querySelectorAll(":scope *:where([data-inview-split])"),o=Array.from(n).filter(function(e){return e.dataset.inviewSplit}),s=Array.from(n).filter(function(e){return!e.dataset.inviewSplit});s&&(i=Array.prototype.concat.apply(i,s)),o&&o.forEach(function(e){var t=e.querySelectorAll(":scope "+e.dataset.inviewSplit);i=Array.prototype.concat.apply(i,t)}),i.forEach(function(e){var t=function(e){for(var t=e.parentElement,r=0;t&&r<=5;){if(t.hasAttribute("data-inview-order"))return parseFloat(t.getAttribute("data-inview-order"));t=t.parentElement,r++}if(e.hasAttribute("data-inview-order")){var a=e.getAttribute("data-inview-order");return!!Number.isInteger(+a)&&+a}return!1}(e);new SplitText(e,{type:"lines",linesClass:"lineChild"}).lines.forEach(function(e){t?(e.dataset.inviewOrder=(t+=.01).toFixed(2),a.push({el:e,order:t})):a.push({el:e,order:!1})})})}}else a.push({el:r,order:r.dataset.inviewOrder});a.sort(function(e,t){return isNaN(e.order)||!1===e.order||null==e.order?1:isNaN(t.order)||!1===t.order||null==t.order?-1:e.order-t.order}),a=a.map(function(e){return e.el});var l={opacity:0,"will-change":"transform",y:20};r.dataset.inviewFrom&&(l=JSON.parse(r.dataset.inviewFrom)),gsap.set(a,l);var d={opacity:1,y:0};r.dataset.inviewTo&&(d=JSON.parse(r.dataset.inviewTo)),ScrollTrigger.batch(r,{start:r.dataset.inviewStart||t.start,onEnter:function(){gsap.to(a,e({},d,{duration:r.dataset.inviewDuration||t.duration,delay:r.dataset.inviewDelay||t.delay,ease:r.dataset.inviewEase||t.ease,stagger:{each:r.dataset.inviewStagger||t.stagger,from:"start"}})),r.classList.add("has-viewed")},markers:!!r.hasAttribute("data-inview-debug"),toggleClass:{targets:r,className:"is-inview"}}),r.hasAttribute("data-inview-debug")&&(console.group("InviewDetection debug instance"),console.log("Parent:",r),console.log("Animating from:",l),console.log("Animating to:",d),console.log("Queued elements:",a),console.groupEnd())})},t}()});
//# sourceMappingURL=InviewDetection.umd.js.map
