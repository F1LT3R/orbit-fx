import Actor from './Actor.mjs'

export default class Timeline {
    constructor(name, start, end, speed, loop, callback, parent) {
        this.name = name
        this.start = start
        this.frame = start
        this.end = end
        this.speed = speed
        this.loop = loop
        this.pause = false
        this.callback = callback
        this.parent = parent
        this.actors = {}
        parent.timelineCount += 1
        return this
    }

    actor(name, objectReference) {
        const existingActor = this.actors[name]

        if (existingActor) {
            return existingActor
        }

        const newActor = new Actor(name, objectReference, null, this)
        this.actors[name] = newActor
        return newActor
    }

    pauseAtFrame(frame) {
        this.paused = true
        this.frame = frame
    }

    play(frame, frameData, callbackQueue) {
        if (typeof frame !== 'undefined') {
            this.frame = frame
        } else if (!this.paused) {
            this.frame += this.speed
        }

        const looping = this.loop

        if (looping) {
            if (this.frame > this.end) {
                this.frame = this.start
            }

            if (this.frame < this.start) {
                this.frame = this.end
            }
        }

        if (!looping) {
            if (this.frame >= this.end) {
                this.frame = this.end
                //this.parent.unload(this.name);

                if (this.callback) {
                    // Queue timeline callbacks too?
                    // The plan focused on keyframe callbacks, but timeline callbacks should probably also be safe.
                    // For now, keeping legacy behavior for timeline callback as it's 'controller' logic, not 'state' logic.
                    // But to be consistent with state, we might arguably queue it.
                    // User only asked about keyframe callbacks. Sticking to plan to avoid scope creep,
                    // but calling it synchronously is safer for logic flow (looping etc).
                    this.callback(this)
                }
            } else if (this.frame <= this.start) {
                this.frame = this.start
                //this.parent.unload(this.name);

                if (this.callback) {
                    this.callback(this)
                }
            }
        }

        if (this.always) {
            this.always.call(this, this.frame)
        }

        // Pass-through to Actors
        for (var i in this.actors) {
            // New Method: Collect
            this.actors[i].collect(this.frame, frameData, callbackQueue)
        }
    }
}
