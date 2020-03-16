import { Computed } from "vuex";

function mappedComputed(cb: Function) {
    return cb.bind({ $store: {} })
}

export function provideSotreInstance(mapped: { [key: string]: Computed }) {
    const ret: { [key: string]: Function } = {}

    for (let k in mapped) {
        ret[k] = mappedComputed(mapped[k])
    }

    return ret
}
