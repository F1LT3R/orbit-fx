export const style = (box) => {
    const translate = `
        translateX(${box.tx}px)
        translateY(${box.ty}px)
        translateZ(${box.tz}px)
    `
    const rotate = `
        rotateX(${box.rx}deg)
        rotateY(${box.ry}deg)
        rotateZ(${box.rz}deg)
    `
    
    const transform = `${translate} ${rotate}`

    box.$elem.style.transform = transform
}

export const frame = () => {}

export const setup = (cb) => {
    cb && cb()
}
