import Animation, { css3D } from '/vendor/orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 2
const easing = 'inOutQuad'

const animation = new Animation(60)
const timeline = animation.timeline('anim1', 0, 200, speed, false, (timeline) => {
    timeline.pauseAtFrame(0)
})

const rndPos = () => window.innerHeight + Math.random() * 1000
const rndStart = () => 1 + Math.floor(Math.random() * 50)

$boxes.forEach(($box, index) => {
    const endPosition = rndPos()

    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('translateY')
			.key(0, 0, easing)
			.key(rndStart(), 0, easing)
			.key(100, endPosition)
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
