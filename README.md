<h1 align="center">InviewDetection.js</h1>

A powerful javascript library to create sequential animations based on in-view detection. Powered by GSAP.

## TO-DO
 - [Patch] Ensure data-inview-split works on parents in conjunction with data-inview

 - [Feature] Add delay attribute to a child directly to increase stagger
 - [Feature] Custom Events: Bind custom events that are triggered at various points in the animation process.
 - [Feature] Callback Functions: Call custom functions on specific triggers, for instance when the animation starts, completes, or when it loops. Pass data
 - [Feature] JS Apply: Instantiate specific elements via JS by passing objects and arguments, like inview.apply(parent,{})

 - [Consideration] Optional inview delay attached to image load/lazy, or class watch
 - [Consideration] Optional refresh SplitText on resize
 - [Test] Test compatibility with SmoothScroller and native (alternative to Lenis)
 - [Docs] Add code examples of every attribute, with a description
 - [Docs] Add explanation as to what it is (streamlined animations via DOM) and what it is not (not replacing GSAP / JS animations)

## Features
 - Standalone elements
 - Scoping, bind elements to parent
 - Custom queuing and animations
 - Staggered text animations with SplitText
 - Repeatable
 - Target specific screen sizes
 - Debugging mode
 - Lightweight (>3Kb gzipped)

## Dependencies
The following <u>must</u> be instantiated before:
 - GSAP v3 (https://greensock.com/gsap/)
 - GSAP ScrollTrigger (https://greensock.com/scrolltrigger/)
 - GSAP SplitText (https://greensock.com/splittext/)

## Quick start

### Installation

InviewDetection.js requires the GSAP library, as well as ScrollTrigger and SplitText (Club GreenSock) to work. You need to include all of them before InviewDetection.js.

#### Boilerplate

We have already included the file in our [Boilerplate](https://github.com/coderesolution/boilerplate).

#### Use from CDN

```html
<!-- Include GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js"></script>
<script src="/path-to/SplitText.min.js"></script>

<!-- Include InviewDetection -->
<script src="https://cdn.jsdelivr.net/gh/coderesolution/InviewDetection.js/bundled/InviewDetection.min.js"></script>

<script>
	// Register GSAP
	gsap.registerPlugin(ScrollTrigger, SplitText);

	// Initialise InviewDetection
	const inview = new InviewDetection(/*options*/);
</script>

<!-- For better results, hide SplitText by default -->
<style>[data-inview-split] { visibility: hidden; }</style>
```

Alternatively, you can register GSAP inside the inview initialisation:
```html
<script>
	// Initialise InviewDetection and register GSAP ScrollTrigger and SplitText plugins
	const inview = new InviewDetection({
		registerGSAP: true
	});
</script>
```

If you wish to initiate the module but not start it yet, you can do so by setting the `autoStart` to false and running `inview.start()`. This can be helpful if you experience incorrect results when using the `data-inview-split` feature that uses GSAP:
```html
<script>
	// Create instance but do not start automatically
	const inview = new InviewDetection({
		autoStart: false
	});

	// Start it when you are ready
	document.addEventListener('DOMContentLoaded', (event) => {
		inview.start();
	});
</script>
```

#### Install NPM module
```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import InviewDetection from './path-to/InviewDetection';

// Register GSAP
gsap.registerPlugin(ScrollTrigger, SplitText);

// Initialise InviewDetection
const inview = new InviewDetection(/*options*/);
```

## Defaults

You can configure InviewDetection.js default via options (and overwrite them on a per-animation basis using modifiers):

```js
const inview = new InviewDetection({
	elements: '[data-inview]',
	screen: '(min-width: 1025px)',
	duration: 1,
	delay: 1,
	start: 'top 90%',
	ease: 'power4',
	stagger: 0.155,
	animationFrom: {
		opacity: 0,
		'will-change': 'transform',
		y: 20,
	},
	animationTo: {
		opacity: 1,
		y: 0,
	},
	autoStart: true,
	registerGsap: false
});
```

| Name | Type | Description |
| :--- | :---: | :--- |
| `elements` | `string` | Trigger elements, defaults to `data-inview` |
| `screen` | `string` | Set media query conditions via matchMedia to target specific screen sizes (defaults to `'(min-width: 1025px)'`). Use 'all' for every size. |
| `duration` | `number` | Duration of each animation. Defaults to `1` |
| `delay` |  `number` | Delay before animation. Defaults to `1` |
| `start` |  `string` | ScrollTrigger's starting position. Defaults to `top 90%` |
| `ease` |  `string` | Easing of animation ([help](https://greensock.com/docs/Easing)). Defaults to `power4` |
| `stagger` |  `number` | Time between each animation. Defaults to `.155` |
| `animationFrom` |  `json` | The beginning of each animation. Defaults to `{ opacity: 0, 'will-change': 'transform', y: 20 }}` |
| `animationTo` |  `json` | The ending of each animation. Defaults to `{ opacity: 1, y: 0 }}` |
| `autoStart` |  `boolean` | Initialise straight-away. Useful if a delay is needed to fix SplitText issues. |
| `registerGsap` |  `boolean` | Register ScrollTrigger and SplitText automatically. |

## Instructions

### Usage

| Name | Type | Description |
| :--- | :---: | :--- |
| `data-inview` | | Apply attribute to trigger elements that are either standalone or parents of nested items by including a `data-inview-scope` |
| `data-inview-scope` | `string` | Apply to `data-inview` element to specify the scope of nested elements. Use wildcards like `*`, `> *` or selectors `.class, #id`. By default, it will scope only `data-inview-child` and `data-inview-split` elements |
| `data-inview-child` | | Apply attribute to elements that should animate when parent comes into to view |
| `data-inview-split` | `string` | Same as `data-inview-child`, however, apply SplitText to direct text elements to animate per line. Set a value to target specific elements, i.e. `p, li` |

### Modifiers

Apply any of the following to `[data-inview]` element to apply custom settings:

| Name | Type | Description |
| :--- | :---: | :--- |
| `data-inview-debug` | | Set GSAP markers and output helpful console information. |
| `data-inview-screen` | | Enable animation only at specific screen sizes. Defaults to `'(min-width: 1025px)'`. Use 'all' for every size. |
| `data-inview-duration` | `number` | Duration of each element transition. Defaults to `1` |
| `data-inview-delay` | `number` | Delay before entire sequence begins. Defaults to `.4` |
| `data-inview-stagger` | `number` | Delay between each element in sequence. Defaults to `0.095` |
| `data-inview-ease` | `string` | GSAP easing. Defaults to `power4` |
| `data-inview-order` | `number` | Apply an index to scoped elements, either `[data-inview-child]` or `[data-inview-split]` or elements specified in the respective parent's `[data-inview-scope]`. This will adjust the order of the element within the animation sequence. Negative numbers appear first, then positive numbers |
| `data-inview-start` | `string` | When animation begins. Defaults to `top 90%` |
| `data-inview-from` | `json` | Apply custom `gsap.from()` properties for every element (by default sets opacity to 0 and y to 20px). Example: `{"opacity": 0, "y": 20, "rotation": 0}` |
| `data-inview-to` | `json` | Apply custom `gsap.to()` properties for every element (by default sets opacity to 1 and y to 0). Example: `{"opacity": 1, "y": 0, "rotation": 10}` |
| `data-inview-repeat` | | Whether or not to repeat animations when they re-enter the viewport. Disabled by default. |

### Methods

#### Start

Start the initialisation if `autoStart` is set to false.

```js
inview.start();
```

Tip: This is useful if you want to start after the page has loaded, like so:
```js
document.addEventListener('DOMContentLoaded', (event) => {
	inview.start();
});
```

#### Refresh

Update ScrollTrigger calculations.

```js
inview.refresh();
```

#### Stop

Stop all animations so anything not yet visible does not load in.

```js
inview.stop();
```

#### Restart

Stop and restart all animations.

```js
inview.restart();
```

### Classes

The following classes are applied during specific events.
 * `has-viewed` - Once the element has came into view at least once.
 * `is-inview` - Toggles when the element is in view.

## FAQ

<details>
<summary>1. The elements appear for a second before hiding and subsequently animating in</summary>

#### Reason
This is because Javascript has to load before it can hide the elements.

#### Solution
Here are recommended solutions:
* Use critical CSS to apply essential styles on load, such as hiding above-the-fold elements that you wish to animate.
* Add a page transition.
* Add a pre-loader.

</details>

<details>

<summary>2. My `data-inview-split` lines are splitting incorrectly</summary>

#### Reason
This may happen is the text or its' container is modified by Javascript.

#### Solution
As a result, it is best to try disabling autoStart by setting it false and running `inview.start()` when everything else has ran.

#### Example
```html
<script>
// Create instance but do not start automatically
const inview = new InviewDetection({
	autoStart: false
});

// Start it when you are ready
document.addEventListener('DOMContentLoaded', (event) => {
	inview.start();
});
</script>
```

</details>

## Examples of use

- [Code Resolution](https://coderesolution.com/): Digital agency partner.
- [Enumera Molecular](#): Coming soon.
- [Stairwell](#): Coming soon.
- [US Foot & Ankle Specialists](#): Coming soon.

## License

[The MIT License (MIT)](LICENSE)