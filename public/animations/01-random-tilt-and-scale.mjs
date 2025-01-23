import Animation, { css3D } from '/vendor/orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 2
const easingAngle = 'inOutExpo'
const easingScale = 'inOutQuad'

const animation = new Animation(60)
const timeline = animation.timeline('anim1', 0, 100, speed, false, (timeline) => {
    timeline.speed = -speed
})

const rndDeg = () => -22.25 + Math.floor(Math.random() * 45)
const rndScale = () => 1 + (-1 + Math.random() * 2)

$boxes.forEach(($box, index) => {
    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))

		.track('rotateX')
			.key(0, 0, easingAngle)
			.key(100, rndDeg())
		.track('rotateY')
			.key(0, 0, easingAngle)
			.key(100, rndDeg())
		.track('rotateZ')
			.key(0, 0, easingAngle)
			.key(100, rndDeg())

		.track('scaleX')
			.key(0, 1, easingScale)
			.key(100, rndScale())
		.track('scaleY')
			.key(0, 1, easingScale)
			.key(100, rndScale())
		.track('scaleZ')
			.key(0, 1, easingScale)
			.key(100, rndScale())
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
