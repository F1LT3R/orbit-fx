import Animator from 'https://f1lt3r.github.io//orbit-fx/public/orbit-fx/main.mjs'

const $feTurbulence = document.querySelector('#turbulence')
const $feDisplacement = document.querySelector('#displacement')
const $feColorMatrix = document.querySelector('#color-matrix')

console.log($feColorMatrix)

const feTurbulence = {
    baseFrequency: 0.03,
    update() {
        $feTurbulence.setAttribute('baseFrequency', feTurbulence.baseFrequency)
    },
}

const feDisplacement = {
    scale: 0,
    update() {
        $feDisplacement.setAttribute('scale', feDisplacement.scale)
    },
}

const feColorMatrix = {
    values: 0,
    update() {
        $feColorMatrix.setAttribute('values', feColorMatrix.values)
    },
}

const animation = new Animator(60)
const timeline0 = animation.timeline('distort', 1, 180, 1, true)
const timeline1 = animation.timeline('rotateHue', 1, 720, 0.25, true)

timeline0.actor('seed', feTurbulence).track('baseFrequency').key(1, 0.03).key(180, 0.07)

timeline0.actor('scale', feDisplacement).track('scale').key(1, 3).key(180, 10)

timeline1.actor('values', feColorMatrix).track('values').key(1, 0).key(720, 360)

animation.load('distort')
animation.load('rotateHue')
animation.play()
