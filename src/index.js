export default class InviewDetection {
	constructor(options = {}) {
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
				y: 20,
			},
			animationTo: {
				opacity: 1,
				y: 0,
			},
		}
		this.options = { ...this.defaultOptions, ...options }
		this.triggers = []
		this.init()
	}

	getOption(optionName) {
		return this.options[optionName]
	}

	init() {
		gsap.utils.toArray(this.getOption('elements')).forEach((parent, index) => {
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
		const splitElements = parent.querySelectorAll(':scope *:where([data-inview-split])')
		const splitElementsParent = Array.from(splitElements).filter((element) => element.dataset.inviewSplit)
		const selfToSplit = Array.from(splitElements).filter((element) => !element.dataset.inviewSplit)

		let elementsToSplit = [...selfToSplit, ...this.getSplitChildren(splitElementsParent)]

		elementsToSplit.forEach((splitElement) => this.addSplitElement(splitElement, animatedElements))
	}

	getSplitChildren(splitElementsParent) {
		let splitChildren = []

		splitElementsParent.forEach((splitParent) => {
			splitChildren = [
				...splitChildren,
				...splitParent.querySelectorAll(':scope ' + splitParent.dataset.inviewSplit),
			]
		})

		return splitChildren
	}

	addSplitElement(splitElement, animatedElements) {
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
		let animationFromProperties = this.getOption('animationFrom')
		let animationToProperties = this.getOption('animationTo')

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

		const trigger = ScrollTrigger.create({
			trigger: parent,
			start: parent.dataset.inviewStart || this.getOption('start'),
			onEnter: () => {
				gsap.to(animatedElements, {
					...animationToProperties,
					duration: parent.dataset.inviewDuration || this.getOption('duration'),
					delay: parent.dataset.inviewDelay || this.getOption('delay'),
					ease: parent.dataset.inviewEase || this.getOption('ease'),
					stagger: {
						each: parent.dataset.inviewStagger || this.getOption('stagger'),
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

		this.triggers.push(trigger)

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
			duration: this.getOption('duration'),
			delay: this.getOption('delay'),
			start: this.getOption('start'),
			ease: this.getOption('ease'),
			stagger: this.getOption('stagger'),
		})
		console.groupEnd()
	}

	refresh() {
		ScrollTrigger.refresh()
	}

	stop() {
		// Kill ScrollTrigger instances created in this script
		this.triggers.forEach((st) => st.kill())

		// Kill all gsap animations of the elements
		gsap.utils.toArray(this.getOption('elements')).forEach((element) => {
			gsap.killTweensOf(element)
		})
	}

	restart() {
		// Kill all gsap animations of the elements
		gsap.utils.toArray(this.getOption('elements')).forEach((element) => {
			gsap.killTweensOf(element)
		})

		// Reinitialize everything
		this.init()
	}
}
