import { mapGetters } from 'vuex'
import { ObjectWithMethods, MappedGetters } from '../types'
import { createImports } from '../helpers'

export function getGetters<G extends ObjectWithMethods>(getters: G, namespace: string = ''): MappedGetters<G> {
    return createImports(getters, mapGetters, namespace) as MappedGetters<G>
}
