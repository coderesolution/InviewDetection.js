export default class InviewDetection {
	constructor(options = {}) {
		this.elements = options.elements || '[data-inview]'
		this.duration = options.duration || 1
		this.delay = options.delay || 0.4
		this.start = options.start || 'top 90%'
		this.ease = options.ease || 'power4'
		this.stagger = options.stagger || 0.095
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
		gsap.utils.toArray(this.elements).forEach((parent, index) => {
			let animatedElements = []

			if (!parent.hasAttribute('data-inview-scope')) {
				animatedElements.push({ el: parent, order: parent.dataset.inviewOrder })
			} else {
				this.addScopedElements(parent, animatedElements)
				this.addChildElements(parent, animatedElements)
				this.addSplitElements(parent, animatedElements)
			}

			this.orderAnimatedElements(animatedElements)
			this.animateElements(parent, animatedElements, index)
		})
	}

	addScopedElements(parent, animatedElements) {
		if (parent.dataset.inviewScope) {
			parent.querySelectorAll(':scope ' + parent.dataset.inviewScope).forEach((element) => {
				const order = parseFloat(element.dataset.inviewOrder)
				animatedElements.push({ el: element, order: order })
			})
		}
	}

	addChildElements(parent, animatedElements) {
		parent.querySelectorAll(':scope [data-inview-child]').forEach((element) => {
			const order = parseFloat(element.dataset.inviewOrder)
			animatedElements.push({ el: element, order: order })
		})
	}

	findClosestParentOrderAttr(element) {
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
			return isNaN(+value) ? false : +value
		}
		return false
	}

	addSplitElements(parent, animatedElements) {
		if (parent.querySelectorAll(':scope *:where([data-inview-split])')) {
			let elementsToSplit = []

			const splitElements = parent.querySelectorAll(':scope *:where([data-inview-split])')
			const splitElementsParent = Array.from(splitElements).filter((element) => element.dataset.inviewSplit)
			const selfToSplit = Array.from(splitElements).filter((element) => !element.dataset.inviewSplit)

			if (selfToSplit.length > 0) {
				elementsToSplit = Array.prototype.concat.apply(elementsToSplit, selfToSplit)
			}

			if (splitElementsParent.length > 0) {
				splitElementsParent.forEach((splitParent) => {
					const splitChildren = splitParent.querySelectorAll(':scope ' + splitParent.dataset.inviewSplit)
					elementsToSplit = Array.prototype.concat.apply(elementsToSplit, splitChildren)
				})
			}

			elementsToSplit.forEach((splitElement) => {
				let order = this.findClosestParentOrderAttr(splitElement)
				const splitChildren = new SplitText(splitElement, {
					type: 'lines',
					linesClass: 'lineChild',
				})

				splitChildren.lines.forEach((line) => {
					if (order) {
						order += 0.01
						line.dataset.inviewOrder = order.toFixed(2)
						animatedElements.push({
							el: line,
							order: order,
						})
					} else {
						animatedElements.push({
							el: line,
							order: false,
						})
					}
				})
			})
		}
	}

	orderAnimatedElements(animatedElements) {
		animatedElements.sort((a, b) => {
			return (a['order'] ?? 1) - (b['order'] ?? -1)
		})

		for (let i = 0; i < animatedElements.length; i++) {
			animatedElements[i] = animatedElements[i].el
		}
	}

	animateElements(parent, animatedElements, index) {
		let animationFromProperties = this.animationFrom
		let animationToProperties = this.animationTo

		try {
			if (parent.dataset.inviewFrom) {
				animationFromProperties = JSON.parse(parent.dataset.inviewFrom)
			}

			if (parent.dataset.inviewTo) {
				animationToProperties = JSON.parse(parent.dataset.inviewTo)
			}
		} catch (error) {
			console.error('Error parsing JSON', error)
		}

		gsap.set(animatedElements, animationFromProperties)

		ScrollTrigger.batch(parent, {
			start: parent.dataset.inviewStart || this.start,
			onEnter: () => {
				gsap.to(animatedElements, {
					...animationToProperties,
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
			this.debugMode(parent, animatedElements, animationFromProperties, animationToProperties, index)
		}
	}

	debugMode(parent, animatedElements, animationFromProperties, animationToProperties, index) {
		console.group(`InviewDetection() debug instance (${index + 1})`)
		console.log({
			parent: parent,
			elements: animatedElements,
			animationFrom: animationFromProperties,
			animationTo: animationToProperties,
			duration: this.duration,
			delay: this.delay,
			start: this.start,
			ease: this.ease,
			stagger: this.stagger,
		})
		console.groupEnd()
	}
}
