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
      // Define default options
      this.defaultOptions = {
        elements: '[data-inview]',
        duration: 1,
        delay: 0.4,
        start: 'top 90%',
        ease: 'power4',
        stagger: 0.095,
        animationFrom: {
          opacity: 0,
          'will-change': 'transform',
          y: 20
        },
        animationTo: {
          opacity: 1,
          y: 0
        }
      };

      // Merge default options with provided options
      this.options = _extends({}, this.defaultOptions, options);

      // Store ScrollTrigger instances
      this.triggers = [];

      // Initialize the class
      this.init();
    }

    // Function to get a specific option
    var _proto = InviewDetection.prototype;
    _proto.getOption = function getOption(optionName) {
      return this.options[optionName];
    }

    // Initialization function
    ;
    _proto.init = function init() {
      var _this = this;
      try {
        // Convert elements to an array and loop through each
        gsap.utils.toArray(this.getOption('elements')).forEach(function (parent, index) {
          // Define array to hold animated elements
          var animatedElements = [];

          // If the parent doesn't have 'data-inview-scope' attribute,
          // add it to the animated elements
          // Otherwise, add scoped, child, and split elements
          if (!parent.hasAttribute('data-inview-scope')) {
            animatedElements.push({
              el: parent,
              order: parent.dataset.inviewOrder
            });
          } else {
            _this.addScopedElements(parent, animatedElements);
            _this.addChildElements(parent, animatedElements);
            _this.addSplitElements(parent, animatedElements);
          }

          // Order the animated elements based on their 'order' property
          _this.orderAnimatedElements(animatedElements);

          // Animate the elements
          _this.animateElements(parent, animatedElements, index);
        });
      } catch (error) {
        // Catch and log any errors
        console.error('Error initialising InviewDetection:', error);
      }
    }

    // Function to add scoped elements to the animatedElements array
    ;
    _proto.addScopedElements = function addScopedElements(parent, animatedElements) {
      try {
        // If the parent has 'data-inview-scope' attribute,
        // add all elements defined in this attribute to the animatedElements array
        if (parent.dataset.inviewScope) {
          parent.querySelectorAll(':scope ' + parent.dataset.inviewScope).forEach(function (element) {
            var order = parseFloat(element.dataset.inviewOrder);
            animatedElements.push({
              el: element,
              order: order
            });
          });
        }
      } catch (error) {
        // Catch and log any errors
        console.error('Error adding scoped elements:', error);
      }
    }

    // Function to add child elements to the animatedElements array
    ;
    _proto.addChildElements = function addChildElements(parent, animatedElements) {
      try {
        // Add all elements with 'data-inview-child' attribute to the animatedElements array
        parent.querySelectorAll(':scope [data-inview-child]').forEach(function (element) {
          var order = parseFloat(element.dataset.inviewOrder);
          animatedElements.push({
            el: element,
            order: order
          });
        });
      } catch (error) {
        // Catch and log any errors
        console.error('Error adding child elements:', error);
      }
    }

    // Function to find the closest parent with 'data-inview-order' attribute
    ;
    _proto.findClosestParentOrderAttr = function findClosestParentOrderAttr(element) {
      var parent = element.parentElement;
      var ancestorsIndexed = 0;
      var ancestorsLimit = 5;
      // Iterate through parent elements up to ancestorsLimit
      while (parent && ancestorsIndexed <= ancestorsLimit) {
        if (parent.hasAttribute('data-inview-order')) {
          return parseFloat(parent.getAttribute('data-inview-order'));
        }
        parent = parent.parentElement;
        ancestorsIndexed++;
      }
      if (element.hasAttribute('data-inview-order')) {
        var value = element.getAttribute('data-inview-order');
        return isNaN(+value) ? false : +value;
      }
      return false;
    }

    // Function to add split elements to the animatedElements array
    ;
    _proto.addSplitElements = function addSplitElements(parent, animatedElements) {
      var _this2 = this;
      var splitElements = parent.querySelectorAll(':scope *:where([data-inview-split])');
      var splitElementsParent = Array.from(splitElements).filter(function (element) {
        return element.dataset.inviewSplit;
      });
      var selfToSplit = Array.from(splitElements).filter(function (element) {
        return !element.dataset.inviewSplit;
      });
      var elementsToSplit = [].concat(selfToSplit, this.getSplitChildren(splitElementsParent));

      // For each element to split, add it to the animatedElements array
      elementsToSplit.forEach(function (splitElement) {
        return _this2.addSplitElement(splitElement, animatedElements);
      });
    }

    // Function to get split children
    ;
    _proto.getSplitChildren = function getSplitChildren(splitElementsParent) {
      var splitChildren = [];

      // For each split parent, add its children to splitChildren array
      splitElementsParent.forEach(function (splitParent) {
        splitChildren = [].concat(splitChildren, splitParent.querySelectorAll(':scope ' + splitParent.dataset.inviewSplit));
      });
      return splitChildren;
    }

    // Function to add a split element to the animatedElements array
    ;
    _proto.addSplitElement = function addSplitElement(splitElement, animatedElements) {
      try {
        // Find the closest parent with 'data-inview-order' attribute
        var order = this.findClosestParentOrderAttr(splitElement);

        // Split the text of the splitElement into lines
        var splitChildren = new SplitText(splitElement, {
          type: 'lines',
          linesClass: 'lineChild'
        });

        // For each line, add it to the animatedElements array
        splitChildren.lines.forEach(function (line) {
          if (order) {
            order += 0.01;
            line.dataset.inviewOrder = order.toFixed(2);
            animatedElements.push({
              el: line,
              order: order
            });
          } else {
            animatedElements.push({
              el: line,
              order: false
            });
          }
        });
      } catch (error) {
        // Catch and log any errors
        console.error('Error splitting element:', error);
      }
    }

    // Function to order animated elements based on their 'order' property
    ;
    _proto.orderAnimatedElements = function orderAnimatedElements(animatedElements) {
      animatedElements.sort(function (a, b) {
        var _a$order, _b$order;
        return ((_a$order = a['order']) != null ? _a$order : 1) - ((_b$order = b['order']) != null ? _b$order : -1);
      });

      // Replace each animatedElement object with its corresponding element
      for (var i = 0; i < animatedElements.length; i++) {
        animatedElements[i] = animatedElements[i].el;
      }
    }

    // Function to animate the elements
    ;
    _proto.animateElements = function animateElements(parent, animatedElements, index) {
      var _this3 = this;
      var animationFromProperties = this.getOption('animationFrom');
      var animationToProperties = this.getOption('animationTo');
      try {
        // Check if the parent has custom animation properties defined in 'data-inviewFrom' and 'data-inviewTo'
        if (parent.dataset.inviewFrom) {
          animationFromProperties = JSON.parse(parent.dataset.inviewFrom);
        }
        if (parent.dataset.inviewTo) {
          animationToProperties = JSON.parse(parent.dataset.inviewTo);
        }
      } catch (error) {
        // Catch and log any errors
        console.error('Error parsing JSON', error);
      }

      // Set initial animation properties for the animated elements
      gsap.set(animatedElements, animationFromProperties);

      // Create a ScrollTrigger instance for the parent element
      var trigger = ScrollTrigger.create({
        trigger: parent,
        start: parent.dataset.inviewStart || this.getOption('start'),
        onEnter: function onEnter() {
          // Animate the elements when they enter the viewport
          gsap.to(animatedElements, _extends({}, animationToProperties, {
            duration: parent.dataset.inviewDuration || _this3.getOption('duration'),
            delay: parent.dataset.inviewDelay || _this3.getOption('delay'),
            ease: parent.dataset.inviewEase || _this3.getOption('ease'),
            stagger: {
              each: parent.dataset.inviewStagger || _this3.getOption('stagger'),
              from: 'start'
            }
          }));
          parent.classList.add('has-viewed');
        },
        markers: parent.hasAttribute('data-inview-debug') ? true : false,
        toggleClass: {
          targets: parent,
          className: 'is-inview'
        }
      });

      // Store the ScrollTrigger instance
      this.triggers.push(trigger);

      /* Debug mode */
      if (parent.hasAttribute('data-inview-debug')) {
        this.debugMode(parent, animatedElements, animationFromProperties, animationToProperties, index);
      }
    }

    // Function for debug mode logging
    ;
    _proto.debugMode = function debugMode(parent, animatedElements, animationFromProperties, animationToProperties, index) {
      console.group("InviewDetection() debug instance (" + (index + 1) + ")");
      console.log({
        parent: parent,
        elements: animatedElements,
        animationFrom: animationFromProperties,
        animationTo: animationToProperties,
        duration: this.getOption('duration'),
        delay: this.getOption('delay'),
        start: this.getOption('start'),
        ease: this.getOption('ease'),
        stagger: this.getOption('stagger')
      });
      console.groupEnd();
    }

    // Function to refresh ScrollTrigger instances
    ;
    _proto.refresh = function refresh() {
      ScrollTrigger.refresh();
    }

    // Function to stop the animations and ScrollTrigger instances
    ;
    _proto.stop = function stop() {
      // Kill ScrollTrigger instances created in this script
      this.triggers.forEach(function (st) {
        return st.kill();
      });

      // Kill all GSAP animations of the elements
      gsap.utils.toArray(this.getOption('elements')).forEach(function (element) {
        gsap.killTweensOf(element);
      });
    }

    // Function to restart the animations and reinitialise everything
    ;
    _proto.restart = function restart() {
      // Kill all GSAP animations of the elements
      gsap.utils.toArray(this.getOption('elements')).forEach(function (element) {
        gsap.killTweensOf(element);
      });

      // Reinitialise everything
      this.init();
    };
    return InviewDetection;
  }();

  return InviewDetection;

}));
