import { mapGetters } from 'vuex'

import { getGetters } from '@/getMappers/getGetters'
import * as createImportsModule from '@/helpers/createImports'
import { AddHelpers, WithHelpers } from '@/getMappers/addHelpers'

describe('>>> getGetters', () => {
    it('maps provided getters as object to computed getters', () => {
        const getters = {
            foo: () => 1,
            bar: (state: any) => (id: number) => id,
            baz: (state: any) => (val: object) => val
        }
        const expectedOutput = {
            foo: expect.any(Function),
            bar: expect.any(Function)
        }
        type ExpectedOutput = WithHelpers<{
            foo: () => number,
            bar: () => (id: number) => number
            baz: () => (val: object) => object
        }>

        const mappedGetters = getGetters(getters)

        expect<ExpectedOutput>(mappedGetters).toMatchObject(expectedOutput)
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

    it('returns instance of `AddHelpers`', () => {
        const getters = { bar: () => {} }

        const returnValue = getGetters(getters)

        expect(returnValue).toBeInstanceOf(AddHelpers)
    })
})
