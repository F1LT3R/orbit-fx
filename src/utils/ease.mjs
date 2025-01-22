export default {
    step: (x, t, b, c, d) => {
        if (t == d) {
            return d
        } else {
            return 1
        }
    },
    linear: (x, t, b, c, d) => {
        return (c * t) / d + b
    },
    inOutQuad: (x, t, b, c, d) => {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b
        } else {
            return (-c / 2) * (--t * (t - 2) - 1) + b
        }
    },
    inQuad: (x, t, b, c, d) => {
        return c * (t /= d) * t + b
    },
    outQuad: (x, t, b, c, d) => {
        return -c * (t /= d) * (t - 2) + b
    },
    inCubic: (x, t, b, c, d) => {
        return c * (t /= d) * t * t + b
    },
    outCubic: (x, t, b, c, d) => {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    inOutCubic: (x, t, b, c, d) => {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t + b
        } else {
            return (c / 2) * ((t -= 2) * t * t + 2) + b
        }
    },
    inQuart: (x, t, b, c, d) => {
        return c * (t /= d) * t * t * t + b
    },
    outQuart: (x, t, b, c, d) => {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    inOutQuart: (x, t, b, c, d) => {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b
        return (-c / 2) * ((t -= 2) * t * t * t - 2) + b
    },
    inQuint: (x, t, b, c, d) => {
        return c * (t /= d) * t * t * t * t + b
    },
    outQuint: (x, t, b, c, d) => {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    inOutQuint: (x, t, b, c, d) => {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
    },
    inSine: (x, t, b, c, d) => {
        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
    },
    outSine: (x, t, b, c, d) => {
        return c * Math.sin((t / d) * (Math.PI / 2)) + b
    },
    inOutSine: (x, t, b, c, d) => {
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
    },
    inExpo: (x, t, b, c, d) => {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    outExpo: (x, t, b, c, d) => {
        return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
    },
    inOutExpo: (x, t, b, c, d) => {
        if (t == 0) return b
        if (t == d) return b + c
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b
        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
    },
    inCirc: (x, t, b, c, d) => {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    outCirc: (x, t, b, c, d) => {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    inOutCirc: (x, t, b, c, d) => {
        if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
        return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    inElastic: (x, t, b, c, d) => {
        var s = 1.70158
        var p = 0
        var a = c
        if (t == 0) return b
        if ((t /= d) == 1) return b + c
        if (!p) p = d * 0.3
        if (a < Math.abs(c)) {
            a = c
            var s = p / 4
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b
    },
    outElastic: (x, t, b, c, d) => {
        var s = 1.70158
        var p = 0
        var a = c
        if (t == 0) return b
        if ((t /= d) == 1) return b + c
        if (!p) p = d * 0.3
        if (a < Math.abs(c)) {
            a = c
            var s = p / 4
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
        return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b
    },
    inOutElastic: (x, t, b, c, d) => {
        var s = 1.70158
        var p = 0
        var a = c
        if (t == 0) return b
        if ((t /= d / 2) == 2) return b + c
        if (!p) p = d * (0.3 * 1.5)
        if (a < Math.abs(c)) {
            a = c
            var s = p / 4
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
        if (t < 1)
            return (
                -0.5 *
                    (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b
            )
        return (
            a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 +
            c +
            b
        )
    },
    inBack: (x, t, b, c, d) => {
        var s = 1.70158
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    outBack: (x, t, b, c, d) => {
        var s = 1.70158
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    inOutBack: (x, t, b, c, d) => {
        var s = 1.70158
        if ((t /= d / 2) < 1) return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    },
    inBounce: (x, t, b, c, d) => {
        return c - ease.outBounce(x, d - t, 0, c, d) + b
    },
    outBounce: (x, t, b, c, d) => {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
        }
    },
    inOutBounce: (x, t, b, c, d) => {
        if (t < d / 2) {
            return ease.inBounce(x, t * 2, 0, c, d) * 0.5 + b
        } else {
            return ease.outBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
        }
    },
}
