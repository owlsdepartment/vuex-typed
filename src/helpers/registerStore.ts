import { Store } from 'vuex'

let _store: Store<any> | null = null

export function registerStore<S>(store: Store<S>) {
    if (!!_store) {
        console.warn('[vuex-typed] Store was already registered! This method should not be called more than once.')
    }

    _store = store
}

export function getStore() {
    if (!_store) {
        console.error('[vuex-typed] Store wasn\'t registered!')
    }

    return _store
}
