import { css3D } from '/orbit-fx/main.mjs'
import dist from '/helpers/dist.mjs'
import center from '/helpers/center.mjs'

const $boxes = document.querySelectorAll('.box')

const winCenterX = window.innerWidth / 2
const winCenterY = window.innerHeight / 2

const boxes = Array.from($boxes).map(($box) => {
    const handler = css3D($box)
    const boxCenter = center($box)
    const distance = dist(boxCenter.x, boxCenter.x, winCenterX, winCenterY)
    const decoratedHandler = Object.assign({}, handler, { distance })
    return decoratedHandler
})

let t = 0
let interval
let magnitude = 50

const frame = () => {
    t += 0.1

    if (magnitude > 0) {
        magnitude -= 0.4
    } else {
        window.clearInterval(interval)
    }

    boxes.forEach((box) => {
        box.translateZ = 0 + Math.sin(t + box.distance) * magnitude
        box.update({ translateZ: true })
    })
}

const start = () => {
    t = 0
    magnitude = 50

    interval = window.setInterval(() => {
        frame()
    }, 15)
}

export const play = () => {
    start()
}

export const stop = () => {
    window.clearInterval(interval)
}
