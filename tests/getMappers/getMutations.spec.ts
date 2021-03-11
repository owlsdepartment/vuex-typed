import { mapMutations } from 'vuex'

import { getMutations } from '@/getMappers/getMutations'
import * as createImportsModule from '@/helpers/createImports'
import { AddHelpers } from '@/getMappers/addHelpers'

describe('>>> getMutations', () => {
    it('maps provided mutations as object to computed mutations', () => {
        const mutations = {
            foo(state: any, payload: {}) {},
            bar(state: any) {}
        }
        const expectedOutput = {
            foo: expect.any(Function),
            bar: expect.any(Function)
        }
        type ExpectedOutput = {
            foo: (payload: {}) => void;
            bar: () => void;
        }

        const mappedMutations = getMutations(mutations)

        expect(mappedMutations).toMatchObject<ExpectedOutput>(expectedOutput)
    })

    it('passes arguments to `createImport` with `mapMutations`', () => {
        const mutations = { foo(state: any) {} }
        const namespace = 'namespace'
        const spyOnCreate = jest.spyOn(createImportsModule, 'createImports')

        getMutations(mutations, namespace)

        expect(spyOnCreate).toBeCalledWith<[object, Function, string]>(
            mutations, mapMutations, namespace
        )
    })

    it('returns instance of `AddHelpers`', () => {
        const mutations = { foo(state: any) {} }

        const returnValue = getMutations(mutations)

        expect(returnValue).toBeInstanceOf(AddHelpers)
    })
})
