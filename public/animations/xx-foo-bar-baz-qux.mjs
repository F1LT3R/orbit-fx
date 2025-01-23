import Animation, { css3D, ease } from '/vendor/orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 2

const animation = new Animation(60)
const timeline = animation.timeline('random-spin', 0, 100, speed, false, (timeline) => {
    timeline.speed = -speed
})

const easeCount = Object.entries(ease).length
const randomEasing = () => {
    const rnd = Math.floor(Math.random() * easeCount)
    const easeMode = Object.keys(ease)[rnd]
    return 'inOutCirc'
    // return easeMode
}

const rnd = () => -90 + Math.floor(Math.random() * 180)

$boxes.forEach(($box, index) => {
    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('rotateX')
			.key(0, 0, randomEasing())
			.key(100, rnd())
		.track('rotateY')
			.key(0, 0, randomEasing())
			.key(100, rnd())
		.track('rotateZ')
			.key(0, 0, randomEasing())
			.key(100, rnd())
})

animation.load('random-spin')

export const play = () => {
    timeline.speed = speed
    timeline.frame = 0
    animation.play()
}

export const stop = () => {
    animation.stop()
}
