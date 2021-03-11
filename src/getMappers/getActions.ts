import { mapActions } from 'vuex'

import { MethodWithOptionalParam, ObjectWithMethods, OptionalSecondParam, WrapInPromise } from '@/typings/types';
import { createImports } from '@/helpers/createImports'

import { AddHelpers, WithHelpers } from './addHelpers';

export type MappedActions<A extends ObjectWithMethods> = {
    [K in keyof A]: MethodWithOptionalParam<
        OptionalSecondParam<A, K>,
        WrapInPromise<ReturnType<A[K]>>
    >
}

/**
 * Get Vuex actions object, mapped for export
 */
export function getActions<A extends ObjectWithMethods>(actions: A, namespace: string = ''): WithHelpers<MappedActions<A>> {
    return AddHelpers.wrap(
        createImports(actions, mapActions, namespace) as MappedActions<A>
    )
}
