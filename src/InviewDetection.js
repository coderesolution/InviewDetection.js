(function () {
	class InviewDetection {

		constructor( options = {} ) {
			this.elements = options.elements || '[data-inview]';
			this.duration = options.duration || 1;
			this.delay = options.delay || 1;
			this.start = options.start || 'top 90%';
			this.ease = options.ease || 'power4';
			this.stagger = options.stagger || .155;
			this.init();
		}

		init() {

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
			gsap.utils.toArray( this.elements ).forEach( oParent => {

				/**
				* Determine what elements are to be animated
				*/

				/* Create empty array of animated elements */
				var aAnimatedElements = [];

				/* Check elements  */
				if ( ! oParent.hasAttribute( 'data-inview-scope' ) ) {

					/* Add parent element if scope isn't set */
					aAnimatedElements.push({ el: oParent, order: oParent.dataset.inviewOrder });

				} else {

					/* Add elements that are defined in parent scope via `data-inview-scope` attribute */
					if ( oParent.dataset.inviewScope ) {

						oParent.querySelectorAll( ':scope ' + oParent.dataset.inviewScope ).forEach( ( element ) => {
							const order = parseFloat( element.dataset.inviewOrder );
							aAnimatedElements.push({ el: element, order: order });
						});

					}

					/* Add attributed elements that are children with `data-inview-child` attribute */
					if ( oParent.querySelectorAll( ':scope [data-inview-child]' ) ) {

						oParent.querySelectorAll( ':scope [data-inview-child]' ).forEach( ( element ) => {
							const order = parseFloat( element.dataset.inviewOrder );
							aAnimatedElements.push({ el: element, order: order });
						});

					}

					/* Add SplitText elements that are defined with `data-inview-split` attribute */
					if ( oParent.querySelectorAll( ':scope *:where([data-inview-split])' ) ) {

						var aElementsToSplit = [];

						const aSplitElements = oParent.querySelectorAll( ':scope *:where([data-inview-split])' );
						const aSplitElementsParent = Array.from( aSplitElements ).filter( oElement => oElement.dataset.inviewSplit );
						const aSplitElementsSelf = Array.from( aSplitElements ).filter( oElement => ! oElement.dataset.inviewSplit );

						if ( aSplitElementsSelf ) {
							aElementsToSplit = Array.prototype.concat.apply( aElementsToSplit, aSplitElementsSelf );
						}

						if ( aSplitElementsParent ) {
							aSplitElementsParent.forEach( ( oSplitParent ) => {
								const oSplitChildren = oSplitParent.querySelectorAll( ':scope ' + oSplitParent.dataset.inviewSplit );
								aElementsToSplit = Array.prototype.concat.apply( aElementsToSplit, oSplitChildren );
							});
						}

						aElementsToSplit.forEach( ( oSplitElement ) => {

							var iOrder = fnFindClosestParentOrderAttr( oSplitElement );
							const oSplitChildren = new SplitText( oSplitElement, { type: 'lines', linesClass: 'lineChild' });

							oSplitChildren.lines.forEach( ( oLine ) => {
								if ( iOrder ) {
									iOrder += 0.01;
									oLine.dataset.inviewOrder = iOrder.toFixed( 2 );
									aAnimatedElements.push({ el: oLine, order: iOrder });
								} else {
									aAnimatedElements.push({ el: oLine, order: false });
								}
							});

						});

					}

				}

				/* Function to find the closest parent containing the order attribute */
				function fnFindClosestParentOrderAttr( oElement ) {
					let oParent = oElement.parentElement;
					let iAncestorsIndexed = 0;
					let iAncestorsLimit = 5;
					while ( oParent && iAncestorsIndexed <= iAncestorsLimit ) {
						if ( oParent.hasAttribute( 'data-inview-order' ) ) {
							return parseFloat( oParent.getAttribute( 'data-inview-order' ) );
						}
						oParent = oParent.parentElement;
						iAncestorsIndexed++;
					}
					if ( oElement.hasAttribute( 'data-inview-order' ) ) {
						const value = oElement.getAttribute( 'data-inview-order' );
						return Number.isInteger(+value) ? +value : false;
					}
					return false;
				}

				/* Reorder elements based on their order value */
				aAnimatedElements.sort( ( a, b ) => {
					if ( isNaN( a['order'] ) || a['order'] === false || a['order'] === null || a['order'] === undefined ) {
						return 1; // preserve original order of NaN/false/null values
					} else if ( isNaN( b['order'] ) || b['order'] === false || b['order'] === null || b['order'] === undefined ) {
						return -1; // preserve original order of NaN/false/null values
					} else {
						return a['order'] - b['order']; // sort by order value
					}
				});

				aAnimatedElements = aAnimatedElements.map( oElement => oElement.el );

				/**
				* Initial animate FROM properties
				*/
				var aAnimateFromProperties = {
					opacity: 0,
					'will-change': 'transform',
					y: 20
				};

				if ( oParent.dataset.inviewFrom ) {
					aAnimateFromProperties = JSON.parse( oParent.dataset.inviewFrom );
				}
				gsap.set( aAnimatedElements, aAnimateFromProperties );

				/**
				* Animate TO properties (based on scroll position)
				*/
				var aAnimateToProperties = {
					opacity: 1,
					y: 0
				};

				if ( oParent.dataset.inviewTo ) {
					aAnimateToProperties = JSON.parse( oParent.dataset.inviewTo );
				}

				ScrollTrigger.batch( oParent, {
					start: oParent.dataset.inviewStart || this.start,
					onEnter: () => {
						gsap.to( aAnimatedElements, {
							...aAnimateToProperties,
							duration: oParent.dataset.inviewDuration || this.duration,
							delay: oParent.dataset.inviewDelay || this.delay,
							ease: oParent.dataset.inviewEase || this.ease,
							stagger: {
								each: oParent.dataset.inviewStagger || this.stagger,
								from: 'start'
							}
						});
						oParent.classList.add( 'has-viewed' );
					},
					markers: oParent.hasAttribute( 'data-inview-debug' ) ? true : false,
					toggleClass: {
						targets: oParent,
						className: 'is-inview'
					},
				});

				/**
				* DEBUG
				*/
				if ( oParent.hasAttribute( 'data-inview-debug' ) ) {
					console.group( 'uInviewDetection() debug instance' );
					console.log( 'Parent:', oParent );
					console.log( 'Animating from:', aAnimateFromProperties );
					console.log( 'Animating to:', aAnimateToProperties );
					console.log( 'Queued elements:', aAnimatedElements );
					console.groupEnd();
				}

			});

		}

	}

	// Expose the InviewDetection class as a global variable
	window.InviewDetection = InviewDetection;

})();