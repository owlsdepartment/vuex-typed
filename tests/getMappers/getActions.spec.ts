import { mapActions } from 'vuex'

import { getActions } from '@/getMappers/getActions'
import * as createImportsModule from '@/helpers/createImports'
import { WithHelpers } from '@/getMappers/withHelpers'

describe('>>> getActions', () => {
    it('maps provided actions as object to computed actions', () => {
        const actions = {
            async foo(ctx: any, payload: {}): Promise<void> {},
            bar(ctx: any) {}
        }
        const expectedOutput = {
            foo: expect.any(Function),
            bar: expect.any(Function)
        }
        type ExpectedOutput = {
            foo: (payload: {}) => Promise<void>;
            bar: () => void;
        }

        const mappedActions = getActions(actions)

        expect(mappedActions).toMatchObject<ExpectedOutput>(expectedOutput)
    })

    it('passes arguments to `createImport` with `mapActions`', () => {
        const actions = { foo(ctx: any) {} }
        const namespace = 'namespace'
        const spyOnCreate = jest.spyOn(createImportsModule, 'createImports')

        getActions(actions, namespace)

        expect(spyOnCreate).toBeCalledWith<[object, Function, string]>(
            actions, mapActions, namespace
        )
    })

    it('returns instance of `WithHelpers`', () => {
        const actions = { foo(ctx: any) {} }

        const returnValue = getActions(actions)

        expect(returnValue).toBeInstanceOf(WithHelpers)
    })
})
