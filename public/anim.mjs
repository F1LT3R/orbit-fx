import {setup, frame} from './animate.mjs'

const animation =  {
    ms: 0,
    rate: 2,
    easing: 'linear',
    repeat: 'forward-backward'
}

setup(animation, () => {
    const $boxes = [...document.querySelectorAll('.box')]
    
    const rndRot = () => (Math.random() * 90).toFixed(2)
    const rndTrans = () => (Math.random() * 45).toFixed(2)

    const boxes = $boxes.map($box => ({
        $elem: $box,
        rx: 0, ry: 0, rz: 0,
        tx: 0, ty: 0, tz: 0,
        nrx: rndRot(), nry: rndRot(), nrz: rndRot(),
        ntx: rndTrans(), nty: rndTrans(), ntz: rndTrans(),
    }))

    return boxes
})

const transform = (box, t) => {
    box.rx = 0 + (box.nrx - box.rx) / 100 * t
    box.ry = 0 + (box.nry - box.ry) / 100 * t
    box.rz = 0 + (box.nrz - box.rz) / 100 * t
    box.tx = 0 + (box.ntx - box.tx) / 100 * t
    box.ty = 0 + (box.nty - box.ty) / 100 * t
    box.tz = 0 + (box.ntz - box.tz) / 100 * t
}

frame((boxes) => {
    boxes.forEach(box => {
        transform(box, t)
        style(box)
    })
})




let t = 0

const backward = () => {
    const timer2 = window.setInterval(() => {
        t -= rate
    
        if (t < 1) {
            window.clearInterval(timer2)
        }
        
        boxes.forEach(box => {
            transform(box, t)
            style(box)
        })
    }, ms)
}

const forward = () => {
    const timer1 = window.setInterval(() => {
        t += rate

        if (t > 100) {
            window.clearInterval(timer1)
            backward()
        }
        
        boxes.forEach(box => {
            transform(box, t)
            style(box)
        })
    }, ms)
}

forward()   


