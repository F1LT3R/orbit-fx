import Key from './Key.mjs'
import ease from '../utils/ease.mjs'

const sortNumber = function (a, b) {
    return a - b
}

export default class Track {
    constructor(prop, parent) {
        this.prop = prop
        this.ease = ease
        this.parent = parent
        this.keys = []
        this.alwaysCallback
        return this
    }

    key(frame, value, ease, callback) {
        for (let i = 0, l = this.keys.length; i < l; i += 1) {
            if (this.keys[i].frame === frame) {
                return this.keys[i]
            }
        }

        if (arguments.length > 1) {
            const keyIndex = []
            const keyStack = []

            const keyCount = this.keys.length
            const thisKey = (this.keys[keyCount] = new Key(frame, value, ease, callback, this))

            for (let i = 0; i < this.keys.length; i += 1) {
                keyIndex[i] = this.keys[i].frame
            }

            keyIndex.sort(sortNumber)

            for (let i = 0; i < this.keys.length; i += 1) {
                for (let j = 0; j < this.keys.length; j += 1) {
                    if (keyIndex[i] == this.keys[j].frame) {
                        keyStack[i] = this.keys[j]
                    }
                }
            }

            this.keys = []

            for (let i = 0, l = keyStack.length; i < l; i += 1) {
                this.keys[i] = keyStack[i]
            }

            return thisKey
        }

        return false
    }

    play(frame, frameData, callbackQueue) {
        for (let i = 0, l = this.keys.length; i < l; i += 1) {
            const curKey = this.keys[i]
            let nextKey = this.keys[i + 1]

            if (nextKey === undefined && i + 1 > l - 1) {
                nextKey = this.keys[l - 1]
            }

            if (frame >= curKey.frame && frame < nextKey.frame) {
                const objectRef = this.parent.objectReference

                // Initialize Registry Entries if needed
                if (!frameData.has(objectRef)) {
                    frameData.set(objectRef, new Map())
                }
                const objProps = frameData.get(objectRef)

                if (!objProps.has(this.prop)) {
                    objProps.set(this.prop, [])
                }
                const valueList = objProps.get(this.prop)

                if (curKey.isArray) {
                    const aryLen = curKey.aryLen
                    // Ensure we are pushing arrays correctly
                    // We need a fresh array for the interpolated result
                    const interpolatedAry = []

                    for (let indice = 0; indice < aryLen; indice += 1) {
                        const val = this.ease[curKey.ease](
                            0,
                            frame - curKey.frame,
                            curKey.value[indice],
                            nextKey.value[indice] - curKey.value[indice],
                            nextKey.frame - curKey.frame,
                        )
                        interpolatedAry[indice] = val
                    }
                    valueList.push(interpolatedAry)
                } else if (curKey.isString) {
                    valueList.push(curKey.value)
                } else {
                    const val = this.ease[curKey.ease](
                        0,
                        frame - curKey.frame,
                        curKey.value,
                        nextKey.value - curKey.value,
                        nextKey.frame - curKey.frame,
                    )
                    valueList.push(val)
                }

                if (this.lastKeyFired && this.lastKeyFired.frame != curKey.frame) {
                    this.lastKeyFired.callbackFired = false
                }

                if (curKey.callback && !curKey.callbackFired) {
                    // Queue the callback
                    callbackQueue.push({
                        fn: curKey.callback,
                        scope: this.parent.objectReference,
                        args: {
                            frame: frame,
                            prop: this.prop,
                            orbitTrack: this,
                        },
                    })

                    curKey.callbackFired = true
                    this.lastKeyFired = curKey
                }
            } else if ((i === l - 1 && frame >= curKey.frame) || (i === 0 && frame === 0)) {
                // Handling edge case where we are sitting exactly on a keyframe
                // 1. We are the Last Key and frame is >= our time (Hold End)
                // 2. We are the First Key and frame is 0 (Hold Start / Pre-start)
                const objectRef = this.parent.objectReference
                if (!frameData.has(objectRef)) frameData.set(objectRef, new Map())
                const objProps = frameData.get(objectRef)
                if (!objProps.has(this.prop)) objProps.set(this.prop, [])
                const valueList = objProps.get(this.prop)

                if (curKey.isArray) {
                    // Push a copy/new array
                    valueList.push([...curKey.value])
                } else if (typeof curKey.value !== 'undefined') {
                    // Check undefined just in case
                    valueList.push(curKey.value)
                }

                // Add Callback Logic here too
                if (curKey.callback && !curKey.callbackFired) {
                    // Queue the callback
                    callbackQueue.push({
                        fn: curKey.callback,
                        scope: this.parent.objectReference,
                        args: {
                            frame: frame,
                            prop: this.prop,
                            orbitTrack: this,
                        },
                    })

                    curKey.callbackFired = true
                    this.lastKeyFired = curKey
                }
            }
        }

        if (this.alwaysCallback) {
            callbackQueue.push({
                fn: this.alwaysCallback,
                scope: this.parent.objectReference,
                args: {
                    frame: frame,
                    prop: this.prop,
                    orbitTrack: this,
                },
            })
        }
    }

    always(func) {
        this.alwaysCallback = func
        return this
    }

    actor(name, objectReference) {
        const timeline = this.parent.parent
        return timeline.obj.call(timeline, name, objectReference)
    }
}
