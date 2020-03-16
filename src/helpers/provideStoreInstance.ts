import { Computed } from 'vuex'
import { getStore } from '../helpers'

function mappedComputed(cb: Function) {
    return (...args: any[]) => cb.apply({ $store: getStore() }, args)
}

export function provideStoreInstance(mapped: { [key: string]: Computed }) {
    const ret: { [key: string]: Function } = {}

    for (let k in mapped) {
        ret[k] = mappedComputed(mapped[k])
    }

    return ret
}
