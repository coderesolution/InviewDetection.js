function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},e.apply(this,arguments)}class t{constructor(e={}){this.elements=e.elements||"[data-inview]",this.duration=e.duration||1,this.delay=e.delay||1,this.start=e.start||"top 90%",this.ease=e.ease||"power4",this.stagger=e.stagger||.155,this.animationFrom=e.animationFrom||{opacity:0,"will-change":"transform",y:20},this.animationTo=e.animationTo||{opacity:1,y:0},this.init()}init(){gsap.utils.toArray(this.elements).forEach((t,a)=>{var r=[];if(t.hasAttribute("data-inview-scope")){if(t.dataset.inviewScope&&t.querySelectorAll(":scope "+t.dataset.inviewScope).forEach(e=>{const t=parseFloat(e.dataset.inviewOrder);r.push({el:e,order:t})}),t.querySelectorAll(":scope [data-inview-child]")&&t.querySelectorAll(":scope [data-inview-child]").forEach(e=>{const t=parseFloat(e.dataset.inviewOrder);r.push({el:e,order:t})}),t.querySelectorAll(":scope *:where([data-inview-split])")){var i=[];const e=t.querySelectorAll(":scope *:where([data-inview-split])"),a=Array.from(e).filter(e=>e.dataset.inviewSplit),s=Array.from(e).filter(e=>!e.dataset.inviewSplit);s&&(i=Array.prototype.concat.apply(i,s)),a&&a.forEach(e=>{const t=e.querySelectorAll(":scope "+e.dataset.inviewSplit);i=Array.prototype.concat.apply(i,t)}),i.forEach(e=>{var t=function(e){let t=e.parentElement,a=0;for(;t&&a<=5;){if(t.hasAttribute("data-inview-order"))return parseFloat(t.getAttribute("data-inview-order"));t=t.parentElement,a++}if(e.hasAttribute("data-inview-order")){const t=e.getAttribute("data-inview-order");return!!Number.isInteger(+t)&&+t}return!1}(e);new SplitText(e,{type:"lines",linesClass:"lineChild"}).lines.forEach(e=>{t?(e.dataset.inviewOrder=(t+=.01).toFixed(2),r.push({el:e,order:t})):r.push({el:e,order:!1})})})}}else r.push({el:t,order:t.dataset.inviewOrder});r.sort((e,t)=>isNaN(e.order)||!1===e.order||null==e.order?1:isNaN(t.order)||!1===t.order||null==t.order?-1:e.order-t.order),r=r.map(e=>e.el);var s=this.animationFrom;t.dataset.inviewFrom&&(s=JSON.parse(t.dataset.inviewFrom)),gsap.set(r,s);var o=this.animationTo;t.dataset.inviewTo&&(o=JSON.parse(t.dataset.inviewTo)),ScrollTrigger.batch(t,{start:t.dataset.inviewStart||this.start,onEnter:()=>{gsap.to(r,e({},o,{duration:t.dataset.inviewDuration||this.duration,delay:t.dataset.inviewDelay||this.delay,ease:t.dataset.inviewEase||this.ease,stagger:{each:t.dataset.inviewStagger||this.stagger,from:"start"}})),t.classList.add("has-viewed")},markers:!!t.hasAttribute("data-inview-debug"),toggleClass:{targets:t,className:"is-inview"}}),t.hasAttribute("data-inview-debug")&&(console.group(`InviewDetection() debug instance (${a+1})`),console.log({parent:t,elements:r,animationFrom:s,animationTo:o,duration:this.duration,delay:this.delay,start:this.start,ease:this.ease,stagger:this.stagger}),console.groupEnd())})}}export{t as default};
//# sourceMappingURL=InviewDetection.modern.mjs.map
