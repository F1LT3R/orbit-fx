import Animator, { css3D } from '../orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 1
const easing = 'outExpo'

const animation = new Animator(60)
const timeline = animation.timeline('anim1', 0, 150, speed, false, (timeline) => {
    timeline.pauseAtFrame(150)
})

const rndPos = () => 500 + Math.random() * 3000

$boxes.forEach(($box, index) => {
    const startPosition = rndPos()

    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('opacity')
			.key(0, 0, easing)
			.key(100, 1)
		.track('translateZ')
			.key(0, startPosition, easing)
			.key(100, 0)
})

animation.load('anim1')

export const play = () => {
    timeline.frame = 0
    timeline.paused = false
    animation.play()
}

export const stop = () => {
    animation.stop()
}
