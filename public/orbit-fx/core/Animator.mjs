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

        return this
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

        const foundTimeline = Object.entries(this.timelines).find(
            ([key, value]) => value.name === name,
        )

        if (foundTimeline !== undefined) {
            // Fix: Use 'name' as key to prevent overwriting
            this.loaded[name] = foundTimeline
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

        const frameData = new Map()
        const callbackQueue = []

        // 1. Accumulate Phase
        for (const i in this.loaded) {
            if (this.hasOwnProperty('loaded')) {
                const timeline = this.loaded[i][1]
                timeline.play(frame, frameData, callbackQueue)
            }
        }

        // 2. Resolve & Apply Phase
        for (const [objectRef, props] of frameData) {
            let hasUpdates = false
            const tracks = {} // Mock tracks object for update() callback

            for (const [prop, values] of props) {
                // Calculate Average
                // Logic: Sum / Count
                let finalValue

                // Handle Arrays (e.g. color [r,g,b,a] or matrix)
                if (Array.isArray(values[0])) {
                    // Vector average
                    const len = values[0].length
                    finalValue = new Array(len).fill(0)
                    for (let i = 0; i < len; i++) {
                        let sum = 0
                        for (const v of values) sum += v[i]
                        finalValue[i] = sum / values.length
                    }
                } else if (typeof values[0] === 'number') {
                    // Scalar average
                    let sum = 0
                    for (const v of values) sum += v
                    finalValue = sum / values.length
                } else {
                    // Strings/Others: Last write wins (fallback)
                    finalValue = values[values.length - 1]
                }

                // Apply to object
                objectRef[prop] = finalValue

                // Mark for update
                tracks[prop] = true
                hasUpdates = true
            }

            // 3. Update Phase
            if (hasUpdates && typeof objectRef.update === 'function') {
                objectRef.update(tracks)
            }
        }

        // 4. Fire Deferred Callbacks
        for (const cb of callbackQueue) {
            cb.fn.call(cb.scope, cb.args)
        }
    }

    play() {
        if (Object.entries(this.loaded).length === 0) {
            console.warn('You have not loaded any timelines for playback.')
            return
        }

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
