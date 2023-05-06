"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(function () {
  var InviewDetection = /*#__PURE__*/function () {
    function InviewDetection() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, InviewDetection);
      this.elements = options.elements || '[data-inview]';
      this.duration = options.duration || 1;
      this.delay = options.delay || 1;
      this.start = options.start || 'top 90%';
      this.ease = options.ease || 'power4';
      this.stagger = options.stagger || .155;
      this.init();
    }
    _createClass(InviewDetection, [{
      key: "init",
      value: function init() {
        var _this = this;
        /**
        * INFO
        * In-view detection lib.
        *
        * Features:
        * [x] Standalone elements
        * [x] Parent and child element binding with automatic and custom scoping by class/ID/tags
        * [x] Custom queuing
        * [x] Custom delay, duration, ease, stagger settings
        * [x] Custom animations (rotate, skew, colours, and more)
        * [x] SplitText and stagger animations
        * [x] Apply class
        * [x] Change settings sitewide or per element
        * [x] Debugging tools
        *
        * Dependencies:
        * GSAP (ScrollTrigger and SplitText)
        */

        /**
        * INSTRUCTIONS
        * 1. 			Initialise with `const inview = new InviewDetection();`
        * 2. 			Apply `data-inview` attribute to standalone elements, or parents of other nested items to animate.
        * 3. 			Apply `data-inview-scope` attribute to specify the scope of nested elements. Use wildcards like "*", "> *" or
        				selectors. By default, it will look for 'data-inview-child' and `data-inview-split` elements.
        * 4. 			Apply `data-inview-child` to each child, or `data-inview-split` for text (GSAP SplitText).
        */

        /**
        * NOTES
        * 1. 			Note that `data-inview-split` will target immediately nested elements. Set a value to target specific selectors.
        */

        /**
        * PARENT MODIFIERS
        * string 		data-inview-scope 				Set to '*' for everything, '> *' for direct children, leave empty to target itself, or define
        												specific classes, IDs or HTML tags to specificity
        * (no value)	data-inview-debug 				Set GSAP markers and output helpful console information
        * int			data-inview-stagger 			Delay between each element in sequence (defaults to .155)
        * int			data-inview-duration 			Duration of each element transition (defaults to 1)
        * int			data-inview-delay 				Delay before entire sequence begins (defaults to 1)
        * string		data-inview-ease 				GSAP easing (defaults to 'power4')
        * string		data-inview-start 				When animation begins (defaults to 'top 90%')
        * json			data-inview-from 				Custom gsap.from() properties for every element (defaults to opacity=0 and y=20)
        * json			data-inview-to 					Custom gsap.to() properties for every element via JSON format (defaults to opacity=1 and y=0)
        */

        /**
        * ANIMATION ADJUSTMENTS
        * from 			add JSON format to `data-inview-from` attribute, i.e. {"yPercent": "0", "rotation": "0"}
        * to 			add JSON format to `data-inview-to` attribute, i.e. {"yPercent": "-100", "rotation": "5"}
        */

        /**
        * ORDERING MODIFIERS
        * int			data-inview-order 				Apply an index to scoped elements to adjust sequence in ascending order. Negative numbers
        												appear first, then positive numbers. If not set or set to 0, the standard ordering will apply.
        */

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
              gsap.to(aAnimatedElements, _objectSpread(_objectSpread({}, aAnimateToProperties), {}, {
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
            console.group('uInviewDetection() debug instance');
            console.log('Parent:', oParent);
            console.log('Animating from:', aAnimateFromProperties);
            console.log('Animating to:', aAnimateToProperties);
            console.log('Queued elements:', aAnimatedElements);
            console.groupEnd();
          }
        });
      }
    }]);
    return InviewDetection;
  }(); // Expose the InviewDetection class as a global variable
  window.InviewDetection = InviewDetection;
})();