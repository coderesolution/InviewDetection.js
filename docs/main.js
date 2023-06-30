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
const inview = new InviewDetection({
	autoStart: false,
	registerGsap: false
});

/* Buttons */
const oButtons = document.querySelectorAll( '.js-button' );

oButtons.forEach( oButton => {

	oButton.addEventListener( 'click', ( e ) => {

		e.preventDefault()

		switch( oButton.dataset.method ) {
			case 'refresh':
			inview.refresh()
			break;

			case 'stop':
			inview.stop()
			break;

			case 'restart':
			inview.restart()
			break;

			default:
			console.log( 'No method' )

		}

	})

});

document.addEventListener('DOMContentLoaded', (event) => {

	inview.start();

});

inview.on('onEnter', (element) => {
	console.log('Entering top of view:', element)
})
inview.on('onLeave', (element) => {
	console.log('Leaving bottom of view:', element)
})
inview.on('onEnterBack', (element) => {
	console.log('Entering bottom of view:', element)
})
inview.on('onLeaveBack', (element) => {
	console.log('Leaving top of view:', element)
})
inview.on('restart', () => {
	console.log('Restarted')
})
inview.on('stop', (target) => {
	console.log('Stopped', target)
})
inview.on('refresh', () => {
	console.log('Refreshed')
})