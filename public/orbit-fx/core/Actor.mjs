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

    update() {
        this.objectReference.update(this.tracks)
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
