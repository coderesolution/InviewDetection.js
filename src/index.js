export default class InviewDetection {
	constructor(options = {}) {
		this.elements = options.elements || '[data-inview]'
		this.duration = options.duration || 1
		this.delay = options.delay || 1
		this.start = options.start || 'top 90%'
		this.ease = options.ease || 'power4'
		this.stagger = options.stagger || 0.155
		this.animationFrom = options.animationFrom || {
			opacity: 0,
			'will-change': 'transform',
			y: 20,
		}
		this.animationTo = options.animationTo || {
			opacity: 1,
			y: 0,
		}
		this.init()
	}

	init() {
		/**
		 * Loop through each parent
		 */
		gsap.utils.toArray(this.elements).forEach((oParent, iIndex) => {
			/**
			 * Determine what elements are to be animated
			 */

			/* Create empty array of animated elements */
			var aAnimatedElements = []

			/* Check elements  */
			if (!oParent.hasAttribute('data-inview-scope')) {
				/* Add parent element if scope isn't set */
				aAnimatedElements.push({
					el: oParent,
					order: oParent.dataset.inviewOrder,
				})
			} else {
				/* Add elements that are defined in parent scope via `data-inview-scope` attribute */
				if (oParent.dataset.inviewScope) {
					oParent.querySelectorAll(':scope ' + oParent.dataset.inviewScope).forEach((element) => {
						const order = parseFloat(element.dataset.inviewOrder)
						aAnimatedElements.push({
							el: element,
							order: order,
						})
					})
				}

				/* Add attributed elements that are children with `data-inview-child` attribute */
				if (oParent.querySelectorAll(':scope [data-inview-child]')) {
					oParent.querySelectorAll(':scope [data-inview-child]').forEach((element) => {
						const order = parseFloat(element.dataset.inviewOrder)
						aAnimatedElements.push({
							el: element,
							order: order,
						})
					})
				}

				/* Add SplitText elements that are defined with `data-inview-split` attribute */
				if (oParent.querySelectorAll(':scope *:where([data-inview-split])')) {
					var aElementsToSplit = []

					const aSplitElements = oParent.querySelectorAll(':scope *:where([data-inview-split])')
					const aSplitElementsParent = Array.from(aSplitElements).filter(
						(oElement) => oElement.dataset.inviewSplit
					)
					const aSplitElementsSelf = Array.from(aSplitElements).filter(
						(oElement) => !oElement.dataset.inviewSplit
					)

					if (aSplitElementsSelf) {
						aElementsToSplit = Array.prototype.concat.apply(aElementsToSplit, aSplitElementsSelf)
					}

					if (aSplitElementsParent) {
						aSplitElementsParent.forEach((oSplitParent) => {
							const oSplitChildren = oSplitParent.querySelectorAll(
								':scope ' + oSplitParent.dataset.inviewSplit
							)
							aElementsToSplit = Array.prototype.concat.apply(aElementsToSplit, oSplitChildren)
						})
					}

					aElementsToSplit.forEach((oSplitElement) => {
						var iOrder = fnFindClosestParentOrderAttr(oSplitElement)
						const oSplitChildren = new SplitText(oSplitElement, {
							type: 'lines',
							linesClass: 'lineChild',
						})

						oSplitChildren.lines.forEach((oLine) => {
							if (iOrder) {
								iOrder += 0.01
								oLine.dataset.inviewOrder = iOrder.toFixed(2)
								aAnimatedElements.push({
									el: oLine,
									order: iOrder,
								})
							} else {
								aAnimatedElements.push({
									el: oLine,
									order: false,
								})
							}
						})
					})
				}
			}

			/* Function to find the closest parent containing the order attribute */
			function fnFindClosestParentOrderAttr(oElement) {
				let oParent = oElement.parentElement
				let iAncestorsIndexed = 0
				let iAncestorsLimit = 5
				while (oParent && iAncestorsIndexed <= iAncestorsLimit) {
					if (oParent.hasAttribute('data-inview-order')) {
						return parseFloat(oParent.getAttribute('data-inview-order'))
					}
					oParent = oParent.parentElement
					iAncestorsIndexed++
				}
				if (oElement.hasAttribute('data-inview-order')) {
					const value = oElement.getAttribute('data-inview-order')
					return Number.isInteger(+value) ? +value : false
				}
				return false
			}

			/* Reorder elements based on their order value */
			aAnimatedElements.sort((a, b) => {
				if (isNaN(a['order']) || a['order'] === false || a['order'] === null || a['order'] === undefined) {
					return 1 // preserve original order of NaN/false/null values
				} else if (
					isNaN(b['order']) ||
					b['order'] === false ||
					b['order'] === null ||
					b['order'] === undefined
				) {
					return -1 // preserve original order of NaN/false/null values
				} else {
					return a['order'] - b['order'] // sort by order value
				}
			})

			aAnimatedElements = aAnimatedElements.map((oElement) => oElement.el)

			/**
			 * Initial animate FROM properties
			 */
			var aAnimateFromProperties = this.animationFrom

			if (oParent.dataset.inviewFrom) {
				aAnimateFromProperties = JSON.parse(oParent.dataset.inviewFrom)
			}
			gsap.set(aAnimatedElements, aAnimateFromProperties)

			/**
			 * Animate TO properties (based on scroll position)
			 */
			var aAnimateToProperties = this.animationTo

			if (oParent.dataset.inviewTo) {
				aAnimateToProperties = JSON.parse(oParent.dataset.inviewTo)
			}

			ScrollTrigger.batch(oParent, {
				start: oParent.dataset.inviewStart || this.start,
				onEnter: () => {
					gsap.to(aAnimatedElements, {
						...aAnimateToProperties,
						duration: oParent.dataset.inviewDuration || this.duration,
						delay: oParent.dataset.inviewDelay || this.delay,
						ease: oParent.dataset.inviewEase || this.ease,
						stagger: {
							each: oParent.dataset.inviewStagger || this.stagger,
							from: 'start',
						},
					})
					oParent.classList.add('has-viewed')
				},
				markers: oParent.hasAttribute('data-inview-debug') ? true : false,
				toggleClass: {
					targets: oParent,
					className: 'is-inview',
				},
			})

			/* Debug mode */
			if (oParent.hasAttribute('data-inview-debug')) {
				console.group(`InviewDetection() debug instance (${iIndex + 1})`)
				console.log({
					parent: oParent,
					elements: aAnimatedElements,
					animationFrom: aAnimateFromProperties,
					animationTo: aAnimateToProperties,
					duration: this.duration,
					delay: this.delay,
					start: this.start,
					ease: this.ease,
					stagger: this.stagger,
				})
				console.groupEnd()
			}
		})
	}
}
