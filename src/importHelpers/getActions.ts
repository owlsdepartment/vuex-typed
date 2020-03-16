import { mapActions } from 'vuex'
import { ObjectWithMethods, MappedActions } from '../types';
import { createImports } from '../helpers'

export function getActions<A extends ObjectWithMethods>(actions: A, namespace: string = ''): MappedActions<A> {
    return createImports(actions, mapActions, namespace) as MappedActions<A>
}
