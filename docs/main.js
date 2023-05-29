/* Lib */
import InviewDetection from '../src/index';

/* Demo CSS */
import './index.css'

/* Register GSAP and plugins */
gsap.registerPlugin( ScrollTrigger, SplitText );

/* Lenis smooth scroll */
const lenis = new Lenis()

function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

/* Initialise InviewDetection.js */
const inview = new InviewDetection();

// setTimeout( () => {
//
// 	inview.restart();
//
// }, 3000 );