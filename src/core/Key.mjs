export default class Key {
    constructor(frame, value, ease, callback, parent) {
        this.frame = frame
        this.value = value
        if (Array.isArray(value)) {
            this.isArray = true
            this.aryLen = value.length
        }
        if (typeof value == 'string') {
            this.isString = true
        }
        this.ease = ease || 'linear'
        this.callback = callback
        this.callbackFired = false
        this.parent = parent
        return this
    }

    actor(name, objRef) {
        var timeline = this.parent.parent.parent
        return timeline.actors.call(timeline, name, objRef)
    }

    track(name, objRef, prop) {
        var actor = this.parent.parent
        return actor.track.call(actor, name, objRef, prop)
    }

    key(frame, value, ease, callback) {
        var track = this.parent
        return track.key.call(track, frame, value, ease, callback)
    }

    always(func) {
        var track = this.parent
        return track.always.call(track, func)
    }
}
