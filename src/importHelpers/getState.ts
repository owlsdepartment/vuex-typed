import { mapState } from 'vuex'
import { MappedState, State } from '../types'
import { createImports } from '../helpers'

export function getState<S extends State>(state: S, namespace: string = ''): MappedState<S> {
    if (typeof state === 'function') {
        state = (state as Function)()
    }

    return createImports(state, mapState, namespace) as MappedState<S>
}
