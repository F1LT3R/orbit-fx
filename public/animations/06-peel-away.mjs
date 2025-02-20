import Animator, { css3D } from '../orbit-fx/main.mjs'
import center from '../helpers/center.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 1
const easing = 'linear'

const animation = new Animator(60)
const timeline = animation.timeline('anim1', 0, 150, speed, false, (timeline) => {
    timeline.pauseAtFrame(0)
})

const startOffset = ($box) => {
    const x = center($box).x
    const frameOffset = 100 * (x / window.innerWidth)
    return frameOffset
}

$boxes.forEach(($box, index) => {
    const startFrame = startOffset($box)

    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('translateX')
			.key(0, 0)
			.key(startFrame, 0, 'inExpo')
			.key(100, window.innerWidth + 800)
		.track('rotateY')
			.key(0, 0)
			.key(startFrame, 0, easing)
			.key(100, 90)
			.key(150, 180)
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
