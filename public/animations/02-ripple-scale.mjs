import Animation, { css3D } from '/vendor/orbit-fx/main.mjs'
import dist from '/helpers/dist.mjs'
import center from '/helpers/center.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 20

const animation = new Animation(60)
const timeline = animation.timeline('anim1', 0, 1000, speed, false, (timeline) => {
    timeline.speed = -speed
})

const rnd = () => -90 + Math.floor(Math.random() * 180)

const winCenterX = window.innerWidth / 2
const winCenterY = window.innerHeight / 2
const rippleRatio = Math.sqrt(window.innerWidth * window.innerHeight) / 1.25

$boxes.forEach(($box, index) => {
    const boxCenter = center($box)
    const distance = dist(boxCenter.x, boxCenter.x, winCenterX, winCenterY)
    const delay = (600 / rippleRatio) * distance

    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('translateZ')
			.key(delay, 0, 'inOutSine')
			.key(1000, -100)
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
