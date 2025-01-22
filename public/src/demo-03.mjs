import Animation from '/vendor/orbit-fx/main.mjs'

const $box = document.querySelector('.box')

const box = {
    $elem: $box,
    _rotateX: 0,

    get rotateX() {
        return this._rotateX
    },

    set rotateX(value) {
        this._rotateX = value
        this.$elem.style.transform = `rotateX(${value}deg)`
    },
}

const animation = new Animation(60)

/* prettier-ignore */
animation
    .timeline('foo', 0, 100, 1, true)
		.actor('box', box)
			.track('rotateX')
				.key(0, 0, 'outBounce')
				.key(100, 360)
animation.load('foo')
animation.play()
