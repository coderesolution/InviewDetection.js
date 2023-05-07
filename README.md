<h1 align="center">InviewDetection.js</h1>

A powerful javascript library to create sequential animations based on in-view detection. Powered by GSAP.

## Features
 - Standalone elements
 - Scoping, bind elements to parent
 - Custom queuing and animations
 - Staggered text animations with SplitText
 - Debugging mode
 - 3kb in size

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

	// Instantiate InviewDetection
	const inview = new InviewDetection(/*options*/);
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

// Instantiate InviewDetection
const inview = new InviewDetection(/*options*/);
```

## Defaults

You can configure InviewDetection.js via options:

```js
const inview = new InviewDetection({
	elements: '[data-inview]',
	duration: 1,
	delay: 1,
	start: 'top 90%',
	ease: 'power4',
	stagger: 0.155
});
```

| Name | Type | Description |
| :--- | :---: | :--- |
| `elements` | `string` | Trigger elements, defaults to `data-inview` |
| `duration` | `number` | Duration of each animation. Defaults to `1` |
| `delay` |  `number` | Delay before animation. Defaults to `1` |
| `start` |  `string` | ScrollTrigger's starting position. Defaults to `top 90%` |
| `ease` |  `string` | Easing of animation ([help](https://greensock.com/docs/Easing)). Defaults to `power4` |
| `stagger` |  `number` | Time between each animation. Defaults to `.155` |

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
| `data-inview-stagger` | `number` | Delay between each element in sequence. Defaults to `.155` |
| `data-inview-duration` | `number` | Duration of each element transition. Defaults to `1` |
| `data-inview-delay` | `number` | Delay before entire sequence begins. Defaults to `1` |
| `data-inview-ease` | `string` | GSAP easing. Defaults to `power4` |
| `data-inview-start` | `string` | When animation begins. Defaults to `top 90%` |
| `data-inview-from` | `json` | Apply custom `gsap.from()` properties for every element (by default sets opacity to 0 and y to 20px). Example: `{"yPercent": "0", "rotation": "0"}` |
| `data-inview-to` | `json` | Apply custom `gsap.to()` properties for every element (by default sets opacity to 1 and y to 0). Example: `{"yPercent": "-100", "rotation": "5"}` |

### Adjust queue

| Name | Type | Description |
| :--- | :---: | :--- |
| `data-inview-order` | `number` | Apply an index to scoped elements, either `[data-inview-child]` or `[data-inview-split]` or elements specified in the respective parent's `[data-inview-scope]`. This will adjust the order of the element within the animation sequence. Negative numbers appear first, then positive numbers |

## Planned

1. Remove default animation effect of opacity and y and set them as the default `data-inview-from` and `data-inview-to` values.

## Examples of use

- [Code Resolution](https://coderesolution.com/): Digital agency partner.

## License

[The MIT License (MIT)](LICENSE)