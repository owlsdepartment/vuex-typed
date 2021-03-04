import { getModule } from '@/getMappers/getModule'
import * as getState from '@/getMappers/getState'
import * as getGetters from '@/getMappers/getGetters'
import * as getMutations from '@/getMappers/getMutations'
import * as getActions from '@/getMappers/getActions'
import { ModuleDef } from '@/typings'

jest.mock('@/getMappers/getState')
jest.mock('@/getMappers/getGetters')
jest.mock('@/getMappers/getMutations')
jest.mock('@/getMappers/getActions')

describe('>>> getModule', () => {
    it('calls other gets on coresponding fields, passing optionally namespace', () => {
        const module: ModuleDef = {
            state: {},
            getters: {},
            mutations: {},
            actions: {},
        }
        const namespacedModule: ModuleDef = {
            namespaced: true,
            state: {},
            getters: {},
            mutations: {},
            actions: {},
        }
        const namespace = 'namespace'
        const spyOnGetState = jest.spyOn(getState, 'getState')
        const spyOnGetGetters = jest.spyOn(getGetters, 'getGetters')
        const spyOnGetMutations = jest.spyOn(getMutations, 'getMutations')
        const spyOnGetActions = jest.spyOn(getActions, 'getActions')
        type ExpectedArgs = [object | undefined, string]

        getModule(module)
        getModule(namespacedModule, namespace)

        expect(spyOnGetState).toBeCalledWith<ExpectedArgs>(module.state, '')
        expect(spyOnGetGetters).toBeCalledWith<ExpectedArgs>(module.getters, '')
        expect(spyOnGetMutations).toBeCalledWith<ExpectedArgs>(module.mutations, '')
        expect(spyOnGetActions).toBeCalledWith<ExpectedArgs>(module.actions, '')

        expect(spyOnGetState).toBeCalledWith<ExpectedArgs>(namespacedModule.state, namespace)
        expect(spyOnGetGetters).toBeCalledWith<ExpectedArgs>(namespacedModule.getters, namespace)
        expect(spyOnGetMutations).toBeCalledWith<ExpectedArgs>(namespacedModule.mutations, namespace)
        expect(spyOnGetActions).toBeCalledWith<ExpectedArgs>(namespacedModule.actions, namespace)
    })

    it('fills empty fields with objects', () => {
        const emptyModule: ModuleDef = {}

        const { state, actions, mutations, getters } = getModule(emptyModule)

        expect(state).toEqual({})
        expect(getters).toEqual({})
        expect(mutations).toEqual({})
        expect(actions).toEqual({})
    })

    it('throws error when module is namespaced, but no namespace was provided', () => {
        const module: ModuleDef = { namespaced: true }

        expect(() => getModule(module)).toThrowError()
    })
})

