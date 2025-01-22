import Actor from './Actor.mjs'

export default class Timeline {
    constructor(name, start, end, speed, loop, callback, parent) {
        this.name = name
        this.start = start
        this.frame = start
        this.end = end
        this.speed = speed
        this.loop = loop
        this.callback = callback
        this.parent = parent
        this.actors = {}
        parent.timelineCount++
        return this
    }

    actor(name, objectReference) {
        const existingActor = this.actors[name]

        if (existingActor) {
            return existingActor
        }

        const newActor = new Actor(name, objectReference, this)
        this.actors[name] = newActor
        return newActor
    }

    play(frame) {
        this.frame = frame || (this.frame += this.speed)

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
                    this.callback(this.frame)
                }
            }

            if (this.frame <= this.start) {
                this.frame = this.start
                //this.parent.unload(this.name);

                if (this.callback) {
                    this.callback(this.frame)
                }
            }
        }

        let thisActor
        for (var i in this.actors) {
            thisActor = this.actors[i]
            for (var j in thisActor.tracks) {
                thisActor.tracks[j].play(this.frame)
            }
        }

        if (this.always) {
            this.always.call(this, this.frame)
        }
    }
}
