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
		gsap.utils.toArray(this.elements).forEach((parent, iIndex) => {
			/**
			 * Determine what elements are to be animated
			 */

			/* Create empty array of animated elements */
			var elements = []

			/* Check elements  */
			if (!parent.hasAttribute('data-inview-scope')) {
				/* Add parent element if scope isn't set */
				elements.push({
					el: parent,
					order: parent.dataset.inviewOrder,
				})
			} else {
				/* Add elements that are defined in parent scope via `data-inview-scope` attribute */
				if (parent.dataset.inviewScope) {
					parent.querySelectorAll(':scope ' + parent.dataset.inviewScope).forEach((element) => {
						const order = parseFloat(element.dataset.inviewOrder)
						elements.push({
							el: element,
							order: order,
						})
					})
				}

				/* Add attributed elements that are children with `data-inview-child` attribute */
				if (parent.querySelectorAll(':scope [data-inview-child]')) {
					parent.querySelectorAll(':scope [data-inview-child]').forEach((element) => {
						const order = parseFloat(element.dataset.inviewOrder)
						elements.push({
							el: element,
							order: order,
						})
					})
				}

				/* Add SplitText elements that are defined with `data-inview-split` attribute */
				if (parent.querySelectorAll(':scope *:where([data-inview-split])')) {
					var elementsToSplit = []

					const aSplitElements = parent.querySelectorAll(':scope *:where([data-inview-split])')
					const aSplitElementsParent = Array.from(aSplitElements).filter(
						(element) => element.dataset.inviewSplit
					)
					const elementSelfToSplit = Array.from(aSplitElements).filter(
						(element) => !element.dataset.inviewSplit
					)

					if (elementSelfToSplit) {
						elementsToSplit = Array.prototype.concat.apply(elementsToSplit, elementSelfToSplit)
					}

					if (aSplitElementsParent) {
						aSplitElementsParent.forEach((oSplitParent) => {
							const oSplitChildren = oSplitParent.querySelectorAll(
								':scope ' + oSplitParent.dataset.inviewSplit
							)
							elementsToSplit = Array.prototype.concat.apply(elementsToSplit, oSplitChildren)
						})
					}

					elementsToSplit.forEach((oSplitElement) => {
						var order = find_closest_parent_order_attr(oSplitElement)
						const oSplitChildren = new SplitText(oSplitElement, {
							type: 'lines',
							linesClass: 'lineChild',
						})

						oSplitChildren.lines.forEach((oLine) => {
							if (order) {
								order += 0.01
								oLine.dataset.inviewOrder = order.toFixed(2)
								elements.push({
									el: oLine,
									order: order,
								})
							} else {
								elements.push({
									el: oLine,
									order: false,
								})
							}
						})
					})
				}
			}

			/* Function to find the closest parent containing the order attribute */
			function find_closest_parent_order_attr(element) {
				let parent = element.parentElement
				let ancestorsIndexed = 0
				let ancestorsLimit = 5
				while (parent && ancestorsIndexed <= ancestorsLimit) {
					if (parent.hasAttribute('data-inview-order')) {
						return parseFloat(parent.getAttribute('data-inview-order'))
					}
					parent = parent.parentElement
					ancestorsIndexed++
				}
				if (element.hasAttribute('data-inview-order')) {
					const value = element.getAttribute('data-inview-order')
					return Number.isInteger(+value) ? +value : false
				}
				return false
			}

			/* Reorder elements based on their order value */
			elements.sort((a, b) => {
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

			elements = elements.map((element) => element.el)

			/**
			 * Initial animate FROM properties
			 */
			var animateFromProperties = this.animationFrom

			if (parent.dataset.inviewFrom) {
				animateFromProperties = JSON.parse(parent.dataset.inviewFrom)
			}
			gsap.set(elements, animateFromProperties)

			/**
			 * Animate TO properties (based on scroll position)
			 */
			var animateToProperties = this.animationTo

			if (parent.dataset.inviewTo) {
				animateToProperties = JSON.parse(parent.dataset.inviewTo)
			}

			ScrollTrigger.batch(parent, {
				start: parent.dataset.inviewStart || this.start,
				onEnter: () => {
					gsap.to(elements, {
						...animateToProperties,
						duration: parent.dataset.inviewDuration || this.duration,
						delay: parent.dataset.inviewDelay || this.delay,
						ease: parent.dataset.inviewEase || this.ease,
						stagger: {
							each: parent.dataset.inviewStagger || this.stagger,
							from: 'start',
						},
					})
					parent.classList.add('has-viewed')
				},
				markers: parent.hasAttribute('data-inview-debug') ? true : false,
				toggleClass: {
					targets: parent,
					className: 'is-inview',
				},
			})

			/* Debug mode */
			if (parent.hasAttribute('data-inview-debug')) {
				console.group(`InviewDetection() debug instance (${iIndex + 1})`)
				console.log({
					parent: parent,
					elements: elements,
					animationFrom: animateFromProperties,
					animationTo: animateToProperties,
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
