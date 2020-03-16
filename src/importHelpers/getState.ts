import { mapState } from 'vuex'
import { MappedState, State } from '../types'

export function getState<S extends State>(state: S, namespace: string = ''): MappedState<S> {
    if (!state) {
        return {} as MappedState<S>
    }

    const stateKeys = Object.keys(state)
    const args = !namespace ? [stateKeys] : [namespace, stateKeys] as const

    return (mapState as any)(...args) as MappedState<S>
}
