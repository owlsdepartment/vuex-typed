import { mapMutations } from 'vuex'
import { ObjectWithMethods, MappedMutations } from '../types'
import { createImports } from '../helpers'

export function getMutations<M extends ObjectWithMethods>(mutations: M, namespace: string = ''): MappedMutations<M> {
    return createImports(mutations, mapMutations, namespace) as MappedMutations<M>
}
