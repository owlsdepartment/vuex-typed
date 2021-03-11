import { mapState } from 'vuex'

import { ExtractState, StateDef } from '@/typings'
import { createImports } from '@/helpers/createImports'
import { AddHelpers, WithHelpers } from './addHelpers'

export type MappedState<S extends StateDef, Out = ExtractState<S>> = {
    [K in keyof Out]: () => Out[K]
}

/**
 * Get Vuex state object, mapped for export
 */
export function getState<S extends StateDef>(state: S, namespace: string = ''): WithHelpers<MappedState<S>> {
    if (typeof state === 'function') {
        state = (state as Function)()
    }

    return AddHelpers.wrap(
        createImports(state, mapState, namespace) as MappedState<S>
    )
}
