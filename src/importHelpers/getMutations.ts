import { mapMutations } from 'vuex'
import { ObjectWithMethods, MappedMutations } from '../types'

export function getMutations<M extends ObjectWithMethods>(mutations: M, namespace: string = ''): MappedMutations<M> {
    if (!mutations) {
        return {} as MappedMutations<M>
    }

    const mutationsKeys = Object.keys(mutations)
    const args = !namespace ? [mutationsKeys] : [namespace, mutationsKeys] as const

    return (mapMutations as any)(...args) as MappedMutations<M>
}
