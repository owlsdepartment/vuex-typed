import { mapGetters } from 'vuex'
import { ObjectWithMethods, MappedGetters } from '../types'

export function getGetters<G extends ObjectWithMethods>(getters: G, namespace: string = ''): MappedGetters<G> {
    if (!getters) {
        return {} as MappedGetters<G>
    }

    const gettersKeys = Object.keys(getters)
    const args = !namespace ? [gettersKeys] : [namespace, gettersKeys] as const

    return (mapGetters as any)(...args) as MappedGetters<G>
}
