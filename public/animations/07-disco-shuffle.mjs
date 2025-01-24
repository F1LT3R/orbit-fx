import Animation, { css3D } from '../orbit-fx/main.mjs'

const $boxes = document.querySelectorAll('.box')

let speed = 2
const ease = 'linear'

const animation = new Animation(60)
const timeline = animation.timeline('anim1', 0, 120, speed, false, (timeline) => {
    timeline.pauseAtFrame(0)
})

const rndCol = () => Math.floor(Math.random() * 255)
const rndPos = () => -5 + Math.random() * 10

$boxes.forEach(($box, index) => {
    /* prettier-ignore */
    timeline.actor(`box-${index}`, css3D($box))
		.track('translateX')
			.key(0, 0)
			.key(5, rndPos())
			.key(10, rndPos())
			.key(15, rndPos())
			.key(20, rndPos())
			.key(25, rndPos())
			.key(30, rndPos())
			.key(35, rndPos())
			.key(40, rndPos())
			.key(45, rndPos())
			.key(50, rndPos())
			.key(55, rndPos())
			.key(60, rndPos())
			.key(65, rndPos())
			.key(70, rndPos())
			.key(75, rndPos())
			.key(80, rndPos())
			.key(85, rndPos())
			.key(90, rndPos())
			.key(95, rndPos())
			.key(100, rndPos())
			.key(110, 0)
		.track('translateY')
			.key(0, 0)
			.key(5, rndPos())
			.key(10, rndPos())
			.key(15, rndPos())
			.key(20, rndPos())
			.key(25, rndPos())
			.key(30, rndPos())
			.key(35, rndPos())
			.key(40, rndPos())
			.key(45, rndPos())
			.key(50, rndPos())
			.key(55, rndPos())
			.key(60, rndPos())
			.key(65, rndPos())
			.key(70, rndPos())
			.key(75, rndPos())
			.key(80, rndPos())
			.key(85, rndPos())
			.key(90, rndPos())
			.key(95, rndPos())
			.key(100, rndPos())
			.key(110, 0)
		.track('backgroundColor')
			.key(0,   [128, 128, 128, 0.75], ease)
			.key(10,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(20,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(30,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(40,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(50,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(60,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(70,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(80,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(90,  [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(100, [rndCol(), rndCol(), rndCol(), 0.75], ease)
			.key(110, [128, 128, 128, 0.75])
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
