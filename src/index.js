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
			screen: '(min-width: 1025px)',
			autoStart: true,
			registerGsap: false,
		}

		// Merge default options with provided options
		this.options = { ...this.defaultOptions, ...options }

		// Store ScrollTrigger instances
		this.triggers = []

		// Store all animated elements
		this.animatedElements = []

		// Start by default if set
		if (this.getOption('autoStart')) {
			this.init();
		}
	}

	// Function to get a specific option
	getOption(optionName) {
		return this.options[optionName]
	}

	// Initialisation function
	init() {
		try {

			// Preload if option is set
			if (this.getOption('registerGsap')) {
				this.registerGsap();
			}

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

				let animationFromProperties = this.getOption('animationFrom')

				// Check if the parent has custom animation properties defined in 'data-inview-from'
				if (parent.dataset.inviewFrom) {
					animationFromProperties = JSON.parse(parent.dataset.inviewFrom)
				}

				// Animate the elements
				this.animateElements(parent, animatedElements, index)
			})
		} catch (error) {
			// Catch and log any errors
			console.error('Error initialising InviewDetection:', error)
		}
	}

	// Method to load GSAP and SplitText
	registerGsap() {
		return new Promise((resolve, reject) => {
			try {
				gsap.registerPlugin(ScrollTrigger, SplitText);
				resolve();
			} catch (e) {
				reject(e);
			}
		})
	}

	// Function to load and initialize the class
	start() {
		// Initialize the class
		this.init()
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
					this.animatedElements.push(element)
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
				this.animatedElements.push(element)
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
		elementsToSplit.forEach((splitElement) => {
			// If splitElement is a NodeList, handle each Node individually
			if (splitElement instanceof NodeList) {
				splitElement.forEach((node) => this.addSplitElement(node, animatedElements))
			} else {
				this.addSplitElement(splitElement, animatedElements)
			}
		})
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
			// Check if splitElement is a DOM element
			if (splitElement instanceof Element) {
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
						this.animatedElements.push(line)
					} else {
						animatedElements.push({
							el: line,
							order: false,
						})
						this.animatedElements.push(line)
					}

					// Set visibility to visible
					line.style.visibility = 'visible';

				})
			} else {
				// Log an error if splitElement is not a DOM element
				console.error('splitElement is not a DOM element:', splitElement)
			}
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
		// Initialise animation property arrays
		let animationFromPropertiesArray = []
		let animationToPropertiesArray = []

		// Create a matchMedia instance
		const matchMedia = gsap.matchMedia()

		// Get the screen media query
		const screen = parent.dataset.inviewScreen || this.getOption('screen')

		// Initialise a new gsap timeline
		const animation = matchMedia.add(screen, () => {
			let timeline = gsap.timeline({
				scrollTrigger: {
					trigger: parent,
					start: parent.dataset.inviewStart || this.getOption('start'),
					invalidateOnRefresh: true,
					onEnter: async () => {
						timeline.play()
						timeline.hasPlayed = true
					},
					onEnterBack: async () => {
						if (parent.hasAttribute('data-inview-repeat')) {
							timeline.restart()
							timeline.hasPlayed = true
						} else if (!timeline.hasPlayed) {
							timeline.play()
							timeline.hasPlayed = true
						}
					},
					onLeave: () => {
						if (parent.hasAttribute('data-inview-repeat')) {
							timeline.restart().pause()
						}
					},
					onLeaveBack: () => {
						if (parent.hasAttribute('data-inview-repeat')) {
							timeline.restart().pause()
						}
					},
					markers: parent.hasAttribute('data-inview-debug') ? true : false,
					toggleClass: {
						targets: parent,
						className: 'is-inview',
					},
				},
			})

			timeline.hasPlayed = false

			// Initialise a variable to hold the current time position on the timeline
			let currentTime = 0

			animatedElements.forEach((element) => {
				try {
					let animationFromProperties = this.getOption('animationFrom')
					let animationToProperties = this.getOption('animationTo')

					// Check if the element has custom animation properties defined in 'data-inview-from' and 'data-inview-to'
					if (element.dataset.inviewFrom) {
						animationFromProperties = JSON.parse(element.dataset.inviewFrom)
					} else if (parent.dataset.inviewFrom) {
						animationFromProperties = JSON.parse(parent.dataset.inviewFrom)
					}

					if (element.dataset.inviewTo) {
						animationToProperties = JSON.parse(element.dataset.inviewTo)
					} else if (parent.dataset.inviewTo) {
						animationToProperties = JSON.parse(parent.dataset.inviewTo)
					}

					// Push the properties for this element to the arrays
					animationFromPropertiesArray.push(animationFromProperties)
					animationToPropertiesArray.push(animationToProperties)

					// Set initial animation properties for the animated elements
					gsap.set(element, animationFromProperties)

					// Get the stagger time
					let staggerTime = parent.dataset.inviewStagger || this.getOption('stagger')

					// Add the animation to the timeline
					timeline.to(
						element,
						{
							...animationToProperties,
							duration: parent.dataset.inviewDuration || this.getOption('duration'),
							delay: parent.dataset.inviewDelay || this.getOption('delay'),
							ease: parent.dataset.inviewEase || this.getOption('ease'),
						},
						currentTime
					)

					// Increase the current time position by the stagger time for the next animation
					currentTime += parseFloat(staggerTime)
				} catch (e) {
					console.error(`An error occurred while animating the element: ${e}`)
				}
			})

			// Pause the timeline initially, the onEnter/onEnterBack events will play/restart it
			timeline.pause()
		})

		// Debug mode
		if (parent.hasAttribute('data-inview-debug')) {
			this.debugMode(parent, animatedElements, animationFromPropertiesArray, animationToPropertiesArray, index)
		}
	}

	// Function for debug mode logging
	debugMode(parent, animatedElements, animationFromProperties, animationToProperties, index) {
		console.group(`InviewDetection() debug instance (#${index + 1})`)
		console.log({
			parent: parent,
			elements: animatedElements,
			screen: this.getOption('screen'),
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

		// Kill all animations
		const allElements = gsap.utils.toArray(this.getOption('elements')).concat(this.animatedElements)

		allElements.forEach((element) => {
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
