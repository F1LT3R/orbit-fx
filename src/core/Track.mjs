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
        for (var i = 0, l = this.keys.length; i < l; i++) {
            if (this.keys[i].frame === frame) {
                return this.keys[i]
            }
        }

        if (arguments.length > 1) {
            var keyIndex = [],
                keyStack = [],
                thisKey = (this.keys[this.keys.length] = new Key(
                    frame,
                    value,
                    ease,
                    callback,
                    this,
                ))
            for (i = 0; i < this.keys.length; i++) {
                keyIndex[i] = this.keys[i].frame
            }
            keyIndex.sort(sortNumber)
            for (i = 0; i < this.keys.length; i++) {
                for (var j = 0; j < this.keys.length; j++) {
                    if (keyIndex[i] == this.keys[j].frame) {
                        keyStack[i] = this.keys[j]
                    }
                }
            }
            this.keys = []
            for (i = 0, l = keyStack.length; i < l; i++) {
                this.keys[i] = keyStack[i]
            }
            return thisKey
        } else {
            return false
        }
    }

    play(frame) {
        var curKey, nextKey, val, indice, aryLen
        for (var i = 0, l = this.keys.length; i < l; i++) {
            curKey = this.keys[i]
            nextKey = this.keys[i + 1]
            if (nextKey === undefined && i + 1 > l - 1) {
                nextKey = this.keys[l - 1]
            }
            if (frame >= curKey.frame && frame < nextKey.frame) {
                if (curKey.isArray) {
                    aryLen = curKey.aryLen
                    for (indice = 0; indice < aryLen; indice++) {
                        val = this.ease[curKey.ease](
                            0,
                            frame - curKey.frame,
                            curKey.value[indice],
                            nextKey.value[indice] - curKey.value[indice],
                            nextKey.frame - curKey.frame,
                        )
                        this.parent.objRef[this.prop][indice] = val
                    }
                } else if (curKey.isString) {
                    this.parent.objRef[this.prop] = curKey.value
                } else {
                    val = this.ease[curKey.ease](
                        0,
                        frame - curKey.frame,
                        curKey.value,
                        nextKey.value - curKey.value,
                        nextKey.frame - curKey.frame,
                    )
                    this.parent.objRef[this.prop] = val
                }

                if (this.lastKeyFired && this.lastKeyFired.frame != curKey.frame) {
                    this.lastKeyFired.callbackFired = false
                }

                if (curKey.callback && !curKey.callbackFired) {
                    curKey.callback.call(this.parent.objRef, {
                        frame: frame,
                        prop: this.prop,
                        burstTrack: this,
                    })
                    curKey.callbackFired = true
                    this.lastKeyFired = curKey
                }
            } else if (frame >= nextKey.frame || frame === 0) {
                if (curKey.isArray) {
                    aryLen = curKey.aryLen
                    for (indice = 0; indice < aryLen; indice++) {
                        this.parent.objRef[this.prop][indice] = curKey.value[indice]
                    }
                } else if (typeof indice === 'number') {
                    this.parent.objRef[this.prop][indice] = curKey.value
                }
            }
        }
        if (this.alwaysCallback) {
            this.alwaysCallback.call(this.parent.objRef, {
                frame: frame,
                prop: this.prop,
                burstTrack: this,
            })
        }
    }

    always(func) {
        this.alwaysCallback = func
        return this
    }

    actor(name, objRef) {
        var timeline = this.parent.parent
        return timeline.obj.call(timeline, name, objRef)
    }
}
