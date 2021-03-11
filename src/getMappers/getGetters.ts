import { mapGetters } from 'vuex'

import { ObjectWithMethods } from '@/typings/types'
import { createImports } from '@/helpers/createImports'
import { AddHelpers, WithHelpers } from './addHelpers'

export type MappedGetters<G extends ObjectWithMethods> = {
    [K in keyof G]: () => ReturnType<G[K]>
}

/**
 * Get Vuex getters object, mapped for export
 */
export function getGetters<G extends ObjectWithMethods>(getters: G, namespace: string = ''): WithHelpers<MappedGetters<G>> {
    return AddHelpers.wrap(
        createImports(getters, mapGetters, namespace) as MappedGetters<G>
    )
}
