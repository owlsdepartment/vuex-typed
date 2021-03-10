import { ModuleDef } from '@/typings'

import { getState, MappedState } from './getState'
import { getGetters, MappedGetters } from './getGetters'
import { getMutations, MappedMutations } from './getMutations'
import { getActions, MappedActions } from './getActions'

const fields = ['state', 'getters', 'mutations', 'actions'] as const
const methods = {
  state: getState,
  getters: getGetters,
  mutations: getMutations,
  actions: getActions
} as const

type ProvideDefault<T> = T extends null | undefined ? {} : T

type MappedModule<M extends ModuleDef> = {
    state: MappedState<ProvideDefault<M['state']>>,
    getters: MappedGetters<ProvideDefault<M['getters']>>,
    mutations: MappedMutations<ProvideDefault<M['mutations']>>,
    actions: MappedActions<ProvideDefault<M['actions']>>
}

/**
 * Get Vuex module elements, mapped for export
 */
export function getModule<M extends ModuleDef>(module: M, namespace: string = '') {
    const namespaced = !!module.namespaced
    const out: Partial<MappedModule<M>> = {}

    if (namespaced && !namespace) {
        throw new Error('[vuex-typed] Module is namespaced, but the namespace argument wasn\'t provided!')
    }

    for (const field of fields) {
        const method = methods[field] as Function
        const entry = module[field]

        if (entry) {
            out[field] = method(entry, namespace)
        } else {
            out[field] = {} as any
        }
    }

    return out as MappedModule<M>
}

/**
 * Get Vuex module elements, mapped for export
 * Alias for `getModule`
 */
export const getModuleImports = getModule
