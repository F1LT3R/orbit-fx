const transformUnits = {
    rotat: 'deg',
    trans: 'px',
    scale: '',
}

const transforms = [
    'rotateX',
    'rotateY',
    'rotateZ',
    'translateX',
    'translateY',
    'translateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
]

const transform = (tracks, obj) => {
    let transform = ''

    for (let property in tracks) {
        if (!transforms.includes(property)) {
            continue
        }
        const unitName = property.slice(0, 5)
        const unit = transformUnits[unitName]
        const value = obj[property]
        transform += `${property}(${value}${unit}) `
    }

    obj.$element.style.transform = transform
}

const properties = ['opacity', 'backgroundColor']
const arrayLike = ['backgroundColor']

const property = (tracks, obj) => {
    for (let property in tracks) {
        if (!properties.includes(property)) {
            continue
        }

        const value = obj[property]

        if (arrayLike.includes(property)) {
            obj.$element.style[property] = `rgba(${value.join(',')})`
            continue
        }

        obj.$element.style[property] = value
    }
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

        opacity: 1,
        backgroundColor: [128, 128, 128, 0.75],

        update(tracks) {
            transform(tracks, this)
            property(tracks, this)
        },
    }
}
