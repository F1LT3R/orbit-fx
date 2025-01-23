import Timeline from './Timeline.mjs'

export default class Animation {
    fps = 30
    timelineCount = 0
    timelines = {}
    loaded = {}
    onFrame = undefined
    interval = undefined

    constructor(fps, onFrame) {
        this.fps = fps

        if (typeof onFrame === 'function') {
            this.onFrame = onFrame
        }
    }

    timeline(name, start, end, speed, loop, callback) {
        const existingTimeline = this.timelines[name]

        if (existingTimeline) {
            return existingTimeline
        }

        const newTimeline = new Timeline(name, start, end, speed, loop, callback, this)
        this.timelines[name] = newTimeline

        return newTimeline
    }

    load(name) {
        const loadedTimeline = this.loaded[name]

        if (loadedTimeline) {
            return loadedTimeline
        }

        const timelines = Object.entries(this.timelines)
        const timelineCount = timelines.length

        const foundTimeline = Object.entries(this.timelines).find(
            ([key, value]) => value.name === name,
        )

        if (foundTimeline !== undefined) {
            this.loaded[timelineCount] = foundTimeline
            return foundTimeline
        }

        return false
    }

    unload(name) {
        delete this.loaded[name]
        return true
    }

    frame(frame) {
        if (typeof this.onFrame === 'function') {
            this.onFrame()
        }

        for (const i in this.loaded) {
            if (this.hasOwnProperty('loaded')) {
                const timeline = this.loaded[i][1]
                timeline.play(frame)
            }
        }
    }

    play() {
        window.clearInterval(this.interval)

        const millisecondsPerFrame = 1000 / this.fps

        this.interval = window.setInterval(() => {
            this.frame()
        }, millisecondsPerFrame)
    }

    stop() {
        window.clearInterval(this.interval)
        delete this.interval
    }
}
