const units = {
    rotat: 'deg',
    trans: 'px',
    scale: '',
}

export default function ($element) {
    return {
        $element,

        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        scaleX: 0,
        scaleY: 0,
        scaleZ: 0,

        update(tracks) {
            let transform = ''

            for (let property in tracks) {
                const unitName = property.slice(0, 5)
                const unit = units[unitName]
                const value = this[property]

                transform += `${property}(${value}${unit}) `
            }

            this.$element.style.transform = transform
        },
    }
}
