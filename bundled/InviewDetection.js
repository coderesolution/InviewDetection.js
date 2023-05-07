(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.InviewDetection = factory());
})(this, (function () {
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  var InviewDetection = /*#__PURE__*/function () {
    function InviewDetection(options) {
      if (options === void 0) {
        options = {};
      }
      this.elements = options.elements || '[data-inview]';
      this.duration = options.duration || 1;
      this.delay = options.delay || 1;
      this.start = options.start || 'top 90%';
      this.ease = options.ease || 'power4';
      this.stagger = options.stagger || 0.155;
      this.init();
    }
    var _proto = InviewDetection.prototype;
    _proto.init = function init() {
      var _this = this;
      /**
       * Loop through each parent
       */
      gsap.utils.toArray(this.elements).forEach(function (oParent) {
        /**
         * Determine what elements are to be animated
         */

        /* Create empty array of animated elements */
        var aAnimatedElements = [];

        /* Check elements  */
        if (!oParent.hasAttribute('data-inview-scope')) {
          /* Add parent element if scope isn't set */
          aAnimatedElements.push({
            el: oParent,
            order: oParent.dataset.inviewOrder
          });
        } else {
          /* Add elements that are defined in parent scope via `data-inview-scope` attribute */
          if (oParent.dataset.inviewScope) {
            oParent.querySelectorAll(':scope ' + oParent.dataset.inviewScope).forEach(function (element) {
              var order = parseFloat(element.dataset.inviewOrder);
              aAnimatedElements.push({
                el: element,
                order: order
              });
            });
          }

          /* Add attributed elements that are children with `data-inview-child` attribute */
          if (oParent.querySelectorAll(':scope [data-inview-child]')) {
            oParent.querySelectorAll(':scope [data-inview-child]').forEach(function (element) {
              var order = parseFloat(element.dataset.inviewOrder);
              aAnimatedElements.push({
                el: element,
                order: order
              });
            });
          }

          /* Add SplitText elements that are defined with `data-inview-split` attribute */
          if (oParent.querySelectorAll(':scope *:where([data-inview-split])')) {
            var aElementsToSplit = [];
            var aSplitElements = oParent.querySelectorAll(':scope *:where([data-inview-split])');
            var aSplitElementsParent = Array.from(aSplitElements).filter(function (oElement) {
              return oElement.dataset.inviewSplit;
            });
            var aSplitElementsSelf = Array.from(aSplitElements).filter(function (oElement) {
              return !oElement.dataset.inviewSplit;
            });
            if (aSplitElementsSelf) {
              aElementsToSplit = Array.prototype.concat.apply(aElementsToSplit, aSplitElementsSelf);
            }
            if (aSplitElementsParent) {
              aSplitElementsParent.forEach(function (oSplitParent) {
                var oSplitChildren = oSplitParent.querySelectorAll(':scope ' + oSplitParent.dataset.inviewSplit);
                aElementsToSplit = Array.prototype.concat.apply(aElementsToSplit, oSplitChildren);
              });
            }
            aElementsToSplit.forEach(function (oSplitElement) {
              var iOrder = fnFindClosestParentOrderAttr(oSplitElement);
              var oSplitChildren = new SplitText(oSplitElement, {
                type: 'lines',
                linesClass: 'lineChild'
              });
              oSplitChildren.lines.forEach(function (oLine) {
                if (iOrder) {
                  iOrder += 0.01;
                  oLine.dataset.inviewOrder = iOrder.toFixed(2);
                  aAnimatedElements.push({
                    el: oLine,
                    order: iOrder
                  });
                } else {
                  aAnimatedElements.push({
                    el: oLine,
                    order: false
                  });
                }
              });
            });
          }
        }

        /* Function to find the closest parent containing the order attribute */
        function fnFindClosestParentOrderAttr(oElement) {
          var oParent = oElement.parentElement;
          var iAncestorsIndexed = 0;
          var iAncestorsLimit = 5;
          while (oParent && iAncestorsIndexed <= iAncestorsLimit) {
            if (oParent.hasAttribute('data-inview-order')) {
              return parseFloat(oParent.getAttribute('data-inview-order'));
            }
            oParent = oParent.parentElement;
            iAncestorsIndexed++;
          }
          if (oElement.hasAttribute('data-inview-order')) {
            var value = oElement.getAttribute('data-inview-order');
            return Number.isInteger(+value) ? +value : false;
          }
          return false;
        }

        /* Reorder elements based on their order value */
        aAnimatedElements.sort(function (a, b) {
          if (isNaN(a['order']) || a['order'] === false || a['order'] === null || a['order'] === undefined) {
            return 1; // preserve original order of NaN/false/null values
          } else if (isNaN(b['order']) || b['order'] === false || b['order'] === null || b['order'] === undefined) {
            return -1; // preserve original order of NaN/false/null values
          } else {
            return a['order'] - b['order']; // sort by order value
          }
        });

        aAnimatedElements = aAnimatedElements.map(function (oElement) {
          return oElement.el;
        });

        /**
         * Initial animate FROM properties
         */
        var aAnimateFromProperties = {
          opacity: 0,
          'will-change': 'transform',
          y: 20
        };
        if (oParent.dataset.inviewFrom) {
          aAnimateFromProperties = JSON.parse(oParent.dataset.inviewFrom);
        }
        gsap.set(aAnimatedElements, aAnimateFromProperties);

        /**
         * Animate TO properties (based on scroll position)
         */
        var aAnimateToProperties = {
          opacity: 1,
          y: 0
        };
        if (oParent.dataset.inviewTo) {
          aAnimateToProperties = JSON.parse(oParent.dataset.inviewTo);
        }
        ScrollTrigger.batch(oParent, {
          start: oParent.dataset.inviewStart || _this.start,
          onEnter: function onEnter() {
            gsap.to(aAnimatedElements, _extends({}, aAnimateToProperties, {
              duration: oParent.dataset.inviewDuration || _this.duration,
              delay: oParent.dataset.inviewDelay || _this.delay,
              ease: oParent.dataset.inviewEase || _this.ease,
              stagger: {
                each: oParent.dataset.inviewStagger || _this.stagger,
                from: 'start'
              }
            }));
            oParent.classList.add('has-viewed');
          },
          markers: oParent.hasAttribute('data-inview-debug') ? true : false,
          toggleClass: {
            targets: oParent,
            className: 'is-inview'
          }
        });

        /**
         * DEBUG
         */
        if (oParent.hasAttribute('data-inview-debug')) {
          console.group('InviewDetection debug instance');
          console.log('Parent:', oParent);
          console.log('Animating from:', aAnimateFromProperties);
          console.log('Animating to:', aAnimateToProperties);
          console.log('Queued elements:', aAnimatedElements);
          console.groupEnd();
        }
      });
    };
    return InviewDetection;
  }();

  return InviewDetection;

}));
