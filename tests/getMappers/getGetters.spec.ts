import { mapGetters } from 'vuex'

import { getGetters } from '@/getMappers/getGetters'
import * as createImportsModule from '@/helpers/createImports'

describe('>>> getGetters', () => {
    it('maps provided getters as object to computed getters', () => {
        const getters = {
            foo: () => 1,
            bar: (state: any) => (id: number) => id
        }
        const expectedOutput = {
            foo: expect.any(Function),
            bar: expect.any(Function)
        }
        type ExpectedOutput = {
            foo: () => number,
            bar: () => (id: number) => number
        }

        const mappedGetters = getGetters(getters)

        expect(mappedGetters).toMatchObject<ExpectedOutput>(expectedOutput)
    })

    it('passes arguments to `createImport` with `mapGetters`', () => {
        const getters = { bar: () => {} }
        const namespace = 'namespace'
        const spyOnCreate = jest.spyOn(createImportsModule, 'createImports')

        getGetters(getters, namespace)

        expect(spyOnCreate).toBeCalledWith<[object, Function, string]>(
            getters, mapGetters, namespace
        )
    })
})
