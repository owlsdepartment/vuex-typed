import Vuex from 'vuex'
import Vue from 'vue'

import { getStore, registerStore } from '@/helpers'
import { createImports } from '@/helpers/createImports'

describe('>>> createImports', () => {
    it('returns empty object if falsy value was passed', () => {
        const method = () => {}
        const originalError = console.error

        console.error = () => {}

        expect(createImports(undefined as any, method)).toEqual({})
        expect(createImports(null as any, method)).toEqual({})
        expect(createImports(false as any, method)).toEqual({})
        expect(createImports('' as any, method)).toEqual({})
        expect(createImports([] as any, method)).toEqual({})

        console.error = originalError
    })

    it('logs error when wrong arguemnt of wrong type was passed', () => {
        const spyOnConsole = jest.spyOn(console, 'error').mockImplementation()

        createImports([] as any, () => {})
        createImports('text' as any, () => {})
        createImports((() => {}) as any, () => {})

        expect(spyOnConsole).toBeCalledTimes(3)
    })

    it('call provided method with passed object keys and optionally passed namespace', () => {
        const testObject = {
            foo: () => {},
            bar: () => {},
            baz: () => {},
        }
        const testMethod = jest.fn()
        const testMethodWithNamespace = jest.fn()
        const testNamespace = 'namespace'

        createImports(testObject, testMethod)
        createImports(testObject, testMethodWithNamespace, testNamespace)

        expect(testMethod).toBeCalledWith<[string[]]>(Object.keys(testObject))
        expect(testMethodWithNamespace).toBeCalledWith<[string, string[]]>(testNamespace, Object.keys(testObject))
    })

    it('provides store instance as this.$store for methods returned from method argument', () => {
        Vue.use(Vuex)

        const testStore = new Vuex.Store({})
        registerStore(testStore)

        const testFoo = jest.fn().mockReturnThis()
        const testObject = { foo() {} }
        const testMethod = (keys: string[]) => {
            const out: Record<string, Function> = {}

            for (const key of keys) {
                out[key] = testFoo
            }

            return out
        }

        createImports(testObject, testMethod).foo()

        expect(testFoo.mock.results[0].type).toBe('return')
        expect(testFoo.mock.results[0].value?.$store).toEqual(getStore())
    })
})
