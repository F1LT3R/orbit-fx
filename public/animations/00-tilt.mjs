import Animation, { css3D } from '/orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 2
const easing = 'outExpo'

const animation = new Animation(60)
const timeline = animation.timeline('anim1', 0, 100, speed, false, (timeline) => {
    timeline.speed = -speed
})

const rnd = () => -11.125 + Math.floor(Math.random() * 22.25)

$boxes.forEach(($box, index) => {
    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('rotateX')
			.key(0, 0, easing)
			.key(100, rnd())
		.track('rotateY')
			.key(0, 0, easing)
			.key(100, rnd())
		.track('rotateZ')
			.key(0, 0, easing)
			.key(100, rnd())
})

animation.load('anim1')

export const play = () => {
    timeline.speed = speed
    timeline.frame = 0
    animation.play()
}

export const stop = () => {
    animation.stop()
}
