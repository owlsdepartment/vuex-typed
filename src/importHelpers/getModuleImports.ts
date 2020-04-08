import { getState } from './getState'
import { getGetters } from './getGetters'
import { getMutations } from './getMutations'
import { getActions } from './getActions'
import { ObjectWithMethods, Module, MappedModule, StateDef } from '../types'

const fields = ['state', 'getters', 'mutations', 'actions'] as const
const methods = {
  state: getState,
  getters: getGetters,
  mutations: getMutations,
  actions: getActions
} as const

export function getModuleImports<S extends StateDef, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods>(
  module: Module<S, G, M, A>, namespace: string = ''
) {
  const namespaced = !!module.namespaced
  const out: any = {}

  if (namespaced && !namespace) {
    throw new Error('[vuex-typed] Module is namespaced, but the namespace argument wasn\'t provided!')
  }

  for (let field of fields) {
    let method = methods[field] as Function

    out[field] = method(module[field], namespace)
  }

  return out as MappedModule<S, G, M, A>
}
