import { mapMutations } from 'vuex'

import { ObjectWithMethods, OptionalSecondParam } from '@/typings/types'
import { createImports } from '@/helpers/createImports'
import { AddHelpers, WithHelpers } from './addHelpers'

export type MappedMutations<M extends ObjectWithMethods> = {
    [K in keyof M]: (payload: OptionalSecondParam<M, K>) => void
}

/**
 * Get Vuex mutations object, mapped for export
 */
export function getMutations<M extends ObjectWithMethods>(mutations: M, namespace: string = ''): WithHelpers<MappedMutations<M>> {
    return AddHelpers.wrap(
        createImports(mutations, mapMutations, namespace) as MappedMutations<M>
    )
}
