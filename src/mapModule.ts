import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import { ObjectWithMethods, Module, MappedModule } from './types'

const fields = ['state', 'getters', 'mutations', 'actions'] as const
const methods = {
  state: mapState,
  getters: mapGetters,
  mutations: mapMutations,
  actions: mapActions
} as const

export function mapModule<S, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods>(
  module: Module<S, G, M, A>, namespace: string = ''
) {
  const namespaced = !!module.namespaced
  const out: any = {}

  for (let key of fields) {
    if (module[key]) {
      let keys = Object.keys(module[key] as unknown as object)
      let method = methods[key] as Function

      out[key] = namespaced ? method(namespace, keys) : method(keys)
    } else {
      out[key] = {}
    }
  }

  return out as MappedModule<S, G, M, A>
}
