!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e||self).inviewdetection=t()}(this,function(){function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},e.apply(this,arguments)}/*#__PURE__*/
return function(){function t(e){void 0===e&&(e={}),this.elements=e.elements||"[data-inview]",this.duration=e.duration||1,this.delay=e.delay||1,this.start=e.start||"top 90%",this.ease=e.ease||"power4",this.stagger=e.stagger||.155,this.animationFrom=e.animationFrom||{opacity:0,"will-change":"transform",y:20},this.animationTo=e.animationTo||{opacity:1,y:0},this.init()}return t.prototype.init=function(){var t=this;gsap.utils.toArray(this.elements).forEach(function(a,r){var i=[];if(a.hasAttribute("data-inview-scope")){if(a.dataset.inviewScope&&a.querySelectorAll(":scope "+a.dataset.inviewScope).forEach(function(e){var t=parseFloat(e.dataset.inviewOrder);i.push({el:e,order:t})}),a.querySelectorAll(":scope [data-inview-child]")&&a.querySelectorAll(":scope [data-inview-child]").forEach(function(e){var t=parseFloat(e.dataset.inviewOrder);i.push({el:e,order:t})}),a.querySelectorAll(":scope *:where([data-inview-split])")){var n=[],o=a.querySelectorAll(":scope *:where([data-inview-split])"),s=Array.from(o).filter(function(e){return e.dataset.inviewSplit}),d=Array.from(o).filter(function(e){return!e.dataset.inviewSplit});d&&(n=Array.prototype.concat.apply(n,d)),s&&s.forEach(function(e){var t=e.querySelectorAll(":scope "+e.dataset.inviewSplit);n=Array.prototype.concat.apply(n,t)}),n.forEach(function(e){var t=function(e){for(var t=e.parentElement,a=0;t&&a<=5;){if(t.hasAttribute("data-inview-order"))return parseFloat(t.getAttribute("data-inview-order"));t=t.parentElement,a++}if(e.hasAttribute("data-inview-order")){var r=e.getAttribute("data-inview-order");return!!Number.isInteger(+r)&&+r}return!1}(e);new SplitText(e,{type:"lines",linesClass:"lineChild"}).lines.forEach(function(e){t?(e.dataset.inviewOrder=(t+=.01).toFixed(2),i.push({el:e,order:t})):i.push({el:e,order:!1})})})}}else i.push({el:a,order:a.dataset.inviewOrder});i.sort(function(e,t){return isNaN(e.order)||!1===e.order||null==e.order?1:isNaN(t.order)||!1===t.order||null==t.order?-1:e.order-t.order}),i=i.map(function(e){return e.el});var l=t.animationFrom;a.dataset.inviewFrom&&(l=JSON.parse(a.dataset.inviewFrom)),gsap.set(i,l);var u=t.animationTo;a.dataset.inviewTo&&(u=JSON.parse(a.dataset.inviewTo)),ScrollTrigger.batch(a,{start:a.dataset.inviewStart||t.start,onEnter:function(){gsap.to(i,e({},u,{duration:a.dataset.inviewDuration||t.duration,delay:a.dataset.inviewDelay||t.delay,ease:a.dataset.inviewEase||t.ease,stagger:{each:a.dataset.inviewStagger||t.stagger,from:"start"}})),a.classList.add("has-viewed")},markers:!!a.hasAttribute("data-inview-debug"),toggleClass:{targets:a,className:"is-inview"}}),a.hasAttribute("data-inview-debug")&&(console.group("InviewDetection() debug instance ("+(r+1)+")"),console.log({parent:a,elements:i,animationFrom:l,animationTo:u,duration:t.duration,delay:t.delay,start:t.start,ease:t.ease,stagger:t.stagger}),console.groupEnd())})},t}()});
//# sourceMappingURL=InviewDetection.umd.js.map
