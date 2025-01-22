import Track from './Track.mjs'

export default class Actor {
    constructor(name, objRef, parent) {
        this.name = name
        this.objRef = objRef
        this.parent = parent
        this.tracks = {}
        return this
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
