import { provideStoreInstance } from './provideStoreInstance'

const isObject = (value: any): value is object => {
    const type = typeof value;

    return value != null && type === 'object' && !Array.isArray(value);
}

export function createImports<T extends object>(object: T, method: Function, namespace: string = '') {
    if (!object || !isObject(object)) {
        console.error(
            `[vuex-typed] Wrong argument passed to 'get' function! Expected: 'object', received: '${typeof object}'`
        )

        return {}
    }

    const keys = Object.keys(object)
    const args = !namespace ? [keys] : [namespace, keys] as const

    return provideStoreInstance(method(...args))
}
