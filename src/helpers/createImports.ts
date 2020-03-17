import { provideStoreInstance } from './provideStoreInstance'

export function createImports<T extends object>(object: T, method: Function, namespace: string = '') {
    if (!object) {
        return {}
    }

    const keys = Object.keys(object)
    const args = !namespace ? [keys] : [namespace, keys] as const

    return provideStoreInstance(method(...args))
}
