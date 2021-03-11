import { mapState } from 'vuex'

import { getState } from '@/getMappers/getState'
import * as createImportsModule from '@/helpers/createImports'
import { AddHelpers } from '@/getMappers/addHelpers'

describe('>>> getState', () => {
    it('maps provided state as object or function, to computed getters', () => {
        const objectState = {
            test: 1,
            nested: {
                a: 'string',
                b: [] as number[]
            }
        }
        const functionState = () => ({
            test: 1,
            nested: {
                a: 'string',
                b: [] as number[]
            }
        })
        const expectedOutput = {
            test: expect.any(Function),
            nested: expect.any(Function)
        }
        type ExpectedOutput = {
            test: () => number;
            nested: () => (typeof objectState)['nested'];
        }

        const mappedObjectState = getState(objectState)
        const mappedFunctionState = getState(functionState)

        expect(mappedObjectState).toMatchObject<ExpectedOutput>(expectedOutput)
        expect(mappedFunctionState).toMatchObject<ExpectedOutput>(expectedOutput)
    })

    it('passes arguments to `createImport` with `mapState`', () => {
        const state = { init: 1 }
        const namespace = 'namespace'
        const spyOnCreate = jest.spyOn(createImportsModule, 'createImports')

        getState(state, namespace)

        expect(spyOnCreate).toBeCalledWith<[object, Function, string]>(
            state, mapState, namespace
        )
    })

    it('returns instance of `AddHelpers`', () => {
        const state = { init: 1 }

        const returnValue = getState(state)

        expect(returnValue).toBeInstanceOf(AddHelpers)
    })
})
