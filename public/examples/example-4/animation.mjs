import Animator from 'https://f1lt3r.github.io//orbit-fx/public/orbit-fx/main.mjs'

const $circle = document.querySelector('#circle')
const $square = document.querySelector('#square')
const $triangle = document.querySelector('#triangle')

const circle = {
    cx: 100,
    cy: 100,
    update() {
        $circle.setAttribute('cx', circle.cx)
        $circle.setAttribute('cy', circle.cy)
    },
}

const square = {
    x: 200,
    y: 0,
    update() {
        $square.setAttribute('x', square.x)
        $square.setAttribute('y', square.y)
    },
}

const triangle = {
    tx: 100,
    ty: 100,
    deg: 0,
    update() {
        const transform = `translate(${triangle.tx}, ${triangle.ty}) rotate(${triangle.deg} 100 100)`
        $triangle.setAttribute('transform', transform)
    },
}

const animation = new Animator(60)
const timeline = animation.timeline('goo-dance', 1, 400, 0.25, true)

/* prettier-ignore */
timeline.actor('circle', circle)
	.track('cx')
		.key(1, 100, 'inOutSine')
		.key(100, 300, 'inOutQuart')
		.key(300, 100)
	.track('cy')
		.key(100, 100, 'inOutQuad')
		.key(200, 300, 'inOutElastic')
		.key(400, 100)

/* prettier-ignore */
timeline.actor('square', square)
	.track('x')
		.key(100, 250, 'inOutCirc')
		.key(200, 0, 'inOutCubic')
		.key(400, 250)
	.track('y')
		.key(1, 0, 'inOutBounce')
		.key(100, 200, 'inOutQuint')
		.key(300, 0)

/* prettier-ignore */
timeline.actor('triangle', triangle)
	.track('deg')
		.key(0, 0, 'linear')
		.key(400, 360, 'linear')

animation.load('goo-dance')
animation.play()

const video = document.querySelector('#goo-video')
const sound = document.querySelector('#sound')
sound.addEventListener('click', () => {
    video.muted = !video.muted
    sound.innerText = video.muted ? 'Sound (Off)' : 'Sound (On)'
})

let playing = true
const animate = document.querySelector('#animate')
animate.addEventListener('click', () => {
    playing = !playing
    animate.innerText = playing ? 'Animate (On)' : 'Animate (Off)'
    if (playing) {
        animation.play()
    } else {
        animation.stop()
    }
})

const stopAnimationUpdateButton = () => {
    playing = false
    animation.stop()
    animate.innerText = playing ? 'Animate (On)' : 'Animate (Off)'
}

const circleXCtrl = document.querySelector('input[name="circleX"]')
circleXCtrl.addEventListener('input', (event) => {
    stopAnimationUpdateButton()
    circle.cx = event.target.value
    circle.update()
})

const circleYCtrl = document.querySelector('input[name="circleY"]')
circleYCtrl.addEventListener('input', (event) => {
    stopAnimationUpdateButton()
    circle.cy = event.target.value
    circle.update()
})

const squareXCtrl = document.querySelector('input[name="squareX"]')
squareXCtrl.addEventListener('input', (event) => {
    stopAnimationUpdateButton()
    square.x = event.target.value
    square.update()
})

const squareYCtrl = document.querySelector('input[name="squareY"]')
squareYCtrl.addEventListener('input', (event) => {
    stopAnimationUpdateButton()
    square.y = event.target.value
    square.update()
})

const triangleXCtrl = document.querySelector('input[name="triangleX"]')
triangleXCtrl.addEventListener('input', (event) => {
    stopAnimationUpdateButton()
    triangle.tx = event.target.value
    triangle.update()
})

const triangleYCtrl = document.querySelector('input[name="triangleY"]')
triangleYCtrl.addEventListener('input', (event) => {
    triangle.ty = event.target.value
    triangle.update()
    stopAnimationUpdateButton()
})

const triangleDegCtrl = document.querySelector('input[name="triangleDeg"]')
triangleDegCtrl.addEventListener('input', (event) => {
    triangle.deg = event.target.value
    triangle.update()
    stopAnimationUpdateButton()
})
