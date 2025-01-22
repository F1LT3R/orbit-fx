import Animation, { css3D } from '/vendor/orbit-fx/main.mjs'

const $box = document.querySelector('.box')

const animation = new Animation(60)
/* prettier-ignore */
animation
    .timeline('foo', 0, 100, 1, true)
		.actor('box', css3D($box))
			.track('rotateX')
				.key(0, 0, 'outBounce')
				.key(100, 360)
			.track('rotateY')
				.key(0, 0, 'inOutQuad')
				.key(100, 90)
			.track('rotateZ')
				.key(0, 0, 'inOutBounce')
				.key(100, 45)
animation.load('foo')
animation.play()
