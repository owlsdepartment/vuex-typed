import Vuex from 'vuex'
import Vue from 'vue'

import { getStore, registerStore } from '@/helpers'
import { provideStoreInstance } from '@/helpers/provideStoreInstance'

describe('>>> provideStoreInstance', () => {
    beforeEach(() => {
        Vue.use(Vuex)
        registerStore(new Vuex.Store({}))
    })

    it('should provide store instance for every method inside dictionary', () => {
        const toMap = {
            foo: jest.fn().mockReturnThis(),
            bar: jest.fn().mockReturnThis()
        }
        const mapped = provideStoreInstance(toMap)
        const { foo, bar } = toMap;

        mapped.foo()
        mapped.bar()

        expect(foo.mock.results[0].type).toBe('return')
        expect(foo.mock.results[0].value?.$store).toBe(getStore())

        expect(bar.mock.results[0].type).toBe('return')
        expect(bar.mock.results[0].value?.$store).toBe(getStore())
    })
})
