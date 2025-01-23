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

        const newActor = new Actor(name, objectReference, this)
        this.actors[name] = newActor
        return newActor
    }

    pauseAtFrame(frame) {
        this.paused = true

        for (var i in this.actors) {
            let actor = this.actors[i]

            for (var j in actor.tracks) {
                actor.tracks[j].play(frame)
            }

            actor.update()
        }
    }

    play(frame) {
        if (this.paused) {
            return
        }

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

        let thisActor
        for (var i in this.actors) {
            thisActor = this.actors[i]

            for (var j in thisActor.tracks) {
                thisActor.tracks[j].play(this.frame)
            }

            thisActor.update()
        }

        if (this.always) {
            this.always.call(this, this.frame)
        }
    }
}
