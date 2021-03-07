import { mapActions } from 'vuex'

import { ObjectWithMethods, OptionalSecondParam } from '@/typings/types';
import { createImports } from '@/helpers/createImports'
import { WithHelpers } from './withHelpers';

export type MappedActions<A extends ObjectWithMethods> = {
    [K in keyof A]: <Ret = ReturnType<A[K]>>(
        payload: OptionalSecondParam<A, K>
    ) => Ret extends Promise<any> ? Ret : Promise<Ret>
}

/**
 * Get Vuex actions object, mapped for export
 */
export function getActions<A extends ObjectWithMethods>(actions: A, namespace: string = ''): WithHelpers<MappedActions<A>> {
    return WithHelpers.wrap(
        createImports(actions, mapActions, namespace) as MappedActions<A>
    )
}
