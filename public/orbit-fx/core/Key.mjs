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

    actor(name, objectReference) {
        const timeline = this.parent.parent.parent
        return timeline.actors.call(timeline, name, objectReference)
    }

    track(name, objectReference, prop) {
        const actor = this.parent.parent
        return actor.track.call(actor, name, objectReference, prop)
    }

    key(frame, value, ease, callback) {
        const track = this.parent
        return track.key.call(track, frame, value, ease, callback)
    }

    always(func) {
        const track = this.parent
        return track.always.call(track, func)
    }
}
