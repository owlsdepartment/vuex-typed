import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { registerStore, getStore } from '@/helpers/registerStore'

describe('>>> Module `registerStore`', () => {
    beforeEach(() => {
        Vue.use(Vuex)

        const consoleWarn = console.warn

        console.warn = () => {}
        registerStore(null as any)
        console.warn = consoleWarn
    })

    it('should save store to variable available for access through `getStore`', () => {
        const testStore = new Vuex.Store({})

        registerStore(testStore)

        expect(getStore()).toBe<Store<any>>(testStore)
    })

    it('should warn about already registered store', () => {
        const testStore = new Vuex.Store({})
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

        registerStore(testStore)
        registerStore(testStore)

        expect(consoleSpy).toBeCalledTimes(1)
        expect(typeof consoleSpy.mock.calls[0][0]).toBe('string')
    })

    it('should warn if store wasn\'t registered', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        getStore()

        expect(consoleSpy).toBeCalledTimes(1)
        expect(typeof consoleSpy.mock.calls[0][0]).toBe('string')
    })
})
