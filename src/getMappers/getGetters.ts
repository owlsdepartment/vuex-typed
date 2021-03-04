import { mapGetters } from 'vuex'

import { ObjectWithMethods } from '@/typings/types'
import { createImports } from '@/helpers/createImports'

export type MappedGetters<G extends ObjectWithMethods> = {
    [K in keyof G]: () => ReturnType<G[K]>
}

/**
 * Get Vuex getters object, mapped for export
 */
export function getGetters<G extends ObjectWithMethods>(getters: G, namespace: string = ''): MappedGetters<G> {
    return createImports(getters, mapGetters, namespace) as MappedGetters<G>
}
