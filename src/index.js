export default class InviewDetection {
	constructor(options = {}) {
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
				y: 20,
			},
			animationTo: {
				opacity: 1,
				y: 0,
			},
		}

		// Merge default options with provided options
		this.options = { ...this.defaultOptions, ...options }

		// Store ScrollTrigger instances
		this.triggers = []

		// Initialize the class
		this.init()
	}

	// Function to get a specific option
	getOption(optionName) {
		return this.options[optionName]
	}

	// Initialisation function
	init() {
		try {
			// Convert elements to an array and loop through each
			gsap.utils.toArray(this.getOption('elements')).forEach((parent, index) => {
				// Define array to hold animated elements
				let animatedElements = []

				// If the parent doesn't have 'data-inview-scope' attribute,
				// add it to the animated elements
				// Otherwise, add scoped, child, and split elements
				if (!parent.hasAttribute('data-inview-scope')) {
					animatedElements.push({ el: parent, order: parent.dataset.inviewOrder })
				} else {
					this.addScopedElements(parent, animatedElements)
					this.addChildElements(parent, animatedElements)
					this.addSplitElements(parent, animatedElements)
				}

				// Order the animated elements based on their 'order' property
				this.orderAnimatedElements(animatedElements)

				// Animate the elements
				this.animateElements(parent, animatedElements, index)
			})
		} catch (error) {
			// Catch and log any errors
			console.error('Error initialising InviewDetection:', error)
		}
	}

	// Function to add scoped elements to the animatedElements array
	addScopedElements(parent, animatedElements) {
		try {
			// If the parent has 'data-inview-scope' attribute,
			// add all elements defined in this attribute to the animatedElements array
			if (parent.dataset.inviewScope) {
				parent.querySelectorAll(':scope ' + parent.dataset.inviewScope).forEach((element) => {
					const order = parseFloat(element.dataset.inviewOrder)
					animatedElements.push({ el: element, order: order })
				})
			}
		} catch (error) {
			// Catch and log any errors
			console.error('Error adding scoped elements:', error)
		}
	}

	// Function to add child elements to the animatedElements array
	addChildElements(parent, animatedElements) {
		try {
			// Add all elements with 'data-inview-child' attribute to the animatedElements array
			parent.querySelectorAll(':scope [data-inview-child]').forEach((element) => {
				const order = parseFloat(element.dataset.inviewOrder)
				animatedElements.push({ el: element, order: order })
			})
		} catch (error) {
			// Catch and log any errors
			console.error('Error adding child elements:', error)
		}
	}

	// Function to find the closest parent with 'data-inview-order' attribute
	findClosestParentOrderAttr(element) {
		let parent = element.parentElement
		let ancestorsIndexed = 0
		let ancestorsLimit = 5
		// Iterate through parent elements up to ancestorsLimit
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

	// Function to add split elements to the animatedElements array
	addSplitElements(parent, animatedElements) {
		const splitElements = parent.querySelectorAll(':scope *:where([data-inview-split])')
		const splitElementsParent = Array.from(splitElements).filter((element) => element.dataset.inviewSplit)
		const selfToSplit = Array.from(splitElements).filter((element) => !element.dataset.inviewSplit)

		let elementsToSplit = [...selfToSplit, ...this.getSplitChildren(splitElementsParent)]

		// For each element to split, add it to the animatedElements array
		elementsToSplit.forEach((splitElement) => this.addSplitElement(splitElement, animatedElements))
	}

	// Function to get split children
	getSplitChildren(splitElementsParent) {
		let splitChildren = []

		// For each split parent, add its children to splitChildren array
		splitElementsParent.forEach((splitParent) => {
			splitChildren = [
				...splitChildren,
				...splitParent.querySelectorAll(':scope ' + splitParent.dataset.inviewSplit),
			]
		})

		return splitChildren
	}

	// Function to add a split element to the animatedElements array
	addSplitElement(splitElement, animatedElements) {
		try {
			// Find the closest parent with 'data-inview-order' attribute
			let order = this.findClosestParentOrderAttr(splitElement)

			// Split the text of the splitElement into lines
			const splitChildren = new SplitText(splitElement, {
				type: 'lines',
				linesClass: 'lineChild',
			})

			// For each line, add it to the animatedElements array
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
		} catch (error) {
			// Catch and log any errors
			console.error('Error splitting element:', error)
		}
	}

	// Function to order animated elements based on their 'order' property
	orderAnimatedElements(animatedElements) {
		animatedElements.sort((a, b) => {
			return (a['order'] ?? 1) - (b['order'] ?? -1)
		})

		// Replace each animatedElement object with its corresponding element
		for (let i = 0; i < animatedElements.length; i++) {
			animatedElements[i] = animatedElements[i].el
		}
	}

	// Function to animate the elements
	animateElements(parent, animatedElements, index) {
		let animationFromProperties = this.getOption('animationFrom')
		let animationToProperties = this.getOption('animationTo')

		try {
			// Check if the parent has custom animation properties defined in 'data-inviewFrom' and 'data-inviewTo'
			if (parent.dataset.inviewFrom) {
				animationFromProperties = JSON.parse(parent.dataset.inviewFrom)
			}

			if (parent.dataset.inviewTo) {
				animationToProperties = JSON.parse(parent.dataset.inviewTo)
			}
		} catch (error) {
			// Catch and log any errors
			console.error('Error parsing JSON', error)
		}

		// Set initial animation properties for the animated elements
		gsap.set(animatedElements, animationFromProperties)

		// Create a ScrollTrigger instance for the parent element
		const trigger = ScrollTrigger.create({
			trigger: parent,
			start: parent.dataset.inviewStart || this.getOption('start'),
			onEnter: async () => {
				// Animate the elements when they enter the viewport
				try {
					await gsap.to(animatedElements, {
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

					// Run custom function declared in 'data-inview-call' attribute
					if (parent.dataset.inviewCall) {
						try {
							const fn = new Function(parent.dataset.inviewCall)
							fn()
						} catch (error) {
							console.error('Error running custom function:', error)
						}
					}

					// Check if any child elements have 'data-inview-call' attribute
					const childElements = parent.querySelectorAll(':scope [data-inview-call]')
					childElements.forEach((child) => {
						const childTrigger = ScrollTrigger.create({
							trigger: child,
							onEnter: () => {
								if (child.dataset.inviewCall) {
									try {
										const fn = new Function(child.dataset.inviewCall)
										fn()
									} catch (error) {
										console.error('Error running custom function:', error)
									}
								}
							},
						})
						this.triggers.push(childTrigger)
					})
				} catch (error) {
					console.error('Error animating elements:', error)
				}
			},
			markers: parent.hasAttribute('data-inview-debug') ? true : false,
			toggleClass: {
				targets: parent,
				className: 'is-inview',
			},
		})

		// Store the ScrollTrigger instance
		this.triggers.push(trigger)

		/* Debug mode */
		if (parent.hasAttribute('data-inview-debug')) {
			this.debugMode(parent, animatedElements, animationFromProperties, animationToProperties, index)
		}
	}

	// Function for debug mode logging
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

	// Function to refresh ScrollTrigger instances
	refresh() {
		ScrollTrigger.refresh()
	}

	// Function to stop the animations and ScrollTrigger instances
	stop() {
		// Kill ScrollTrigger instances created in this script
		this.triggers.forEach((st) => st.kill())

		// Kill all GSAP animations of the elements
		gsap.utils.toArray(this.getOption('elements')).forEach((element) => {
			gsap.killTweensOf(element)
		})
	}

	// Function to restart the animations and reinitialise everything
	restart() {
		// Kill all GSAP animations of the elements
		gsap.utils.toArray(this.getOption('elements')).forEach((element) => {
			gsap.killTweensOf(element)
		})

		// Reinitialise everything
		this.init()
	}
}
