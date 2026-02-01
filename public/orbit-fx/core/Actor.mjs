import Track from './Track.mjs'

export default class Actor {
    constructor(name, objectReference, updateCallback, parent) {
        this.name = name
        this.objectReference = objectReference
        this.updateCallback = updateCallback
        this.parent = parent
        this.tracks = {}
        return this
    }

    update(frame) {
        // Deprecated direct update
    }

    collect(frame, frameData, callbackQueue) {
        for (const prop in this.tracks) {
            this.tracks[prop].play(frame, frameData, callbackQueue)
        }
    }

    track(prop) {
        const existingTrack = this.tracks[prop]

        if (existingTrack) {
            return existingTrack
        }

        const newTrack = new Track(prop, this)
        this.tracks[prop] = newTrack
        return newTrack
    }
}
