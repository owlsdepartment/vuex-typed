import { mapActions } from 'vuex'
import { ObjectWithMethods, MappedActions } from '../types';

export function getActions<A extends ObjectWithMethods>(actions: A, namespace: string = ''): MappedActions<A> {
    if (!actions) {
        return {} as MappedActions<A>
    }

    const actionsKeys = Object.keys(actions)
    const args = !namespace ? [actionsKeys] : [namespace, actionsKeys] as const

    return (mapActions as any)(...args) as MappedActions<A>
}
