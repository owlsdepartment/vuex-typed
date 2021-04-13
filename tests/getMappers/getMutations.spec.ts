import { mapMutations } from 'vuex'

import { getMutations } from '@/getMappers/getMutations'
import * as createImportsModule from '@/helpers/createImports'
import { AddHelpers, WithHelpers } from '@/getMappers/addHelpers'

describe('>>> getMutations', () => {
    it('maps provided mutations as object to computed mutations', () => {
        const mutations = {
            nullish(state: any, payload: number | null) {},
            foo(state: any, payload: { a: string }) {},
            bar(state: any) {}
        }
        const expectedOutput = {
            foo: expect.any(Function),
            bar: expect.any(Function),
            nullish: expect.any(Function)
        }
        type ExpectedOutput = WithHelpers<{
            nullish: (payload: number | null) => void;
            foo: (payload: { a: string }) => void;
            bar: () => void;
        }>
        const mappedMutations = getMutations(mutations)

        expect<ExpectedOutput>(mappedMutations).toMatchObject(expectedOutput)
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
