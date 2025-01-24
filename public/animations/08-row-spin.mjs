import Animator, { css3D } from '../orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 0.5
const ease = 'outExpo'

const animation = new Animator(60)
const timeline = animation.timeline('anim1', 0, 600, speed, false)

let offsetFrame = 0
const offsetMultiplier = 20
$boxes.forEach(($box, index) => {
    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('rotateX')
			.key(offsetFrame, 0, ease)
			.key(offsetFrame + (offsetMultiplier * 2), 360)

    offsetFrame += offsetMultiplier / 8
})

animation.load('anim1')

export const play = () => {
    timeline.frame = 0
    animation.play()
}

export const stop = () => {
    animation.stop()
}
