import { mapActions } from 'vuex'

import { getActions } from '@/getMappers/getActions'
import * as createImportsModule from '@/helpers/createImports'
import { AddHelpers, WithHelpers } from '@/getMappers/addHelpers'

describe('>>> getActions', () => {
    it('maps provided actions as object to computed actions', () => {
        const actions = {
            async foo(ctx: any, payload: {}): Promise<void> {},
            bar(ctx: any) {},
            baz(ctx: any, data?: string | null): number {
                return 2;
            }
        }
        const expectedOutput = {
            foo: expect.any(Function),
            bar: expect.any(Function)
        }
        type ExpectedOutput = WithHelpers<{
            foo: (payload: {}) => Promise<void>;
            bar: () => Promise<void>;
            baz: (data?: string | null) => Promise<number>
        }>

        const mappedActions = getActions(actions)

        expect<ExpectedOutput>(mappedActions).toMatchObject(expectedOutput)
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

    it('returns instance of `AddHelpers`', () => {
        const actions = { foo(ctx: any) {} }

        const returnValue = getActions(actions)

        expect(returnValue).toBeInstanceOf(AddHelpers)
    })
})
