import { provideStoreInstance } from './provideStoreInstance'

export function createImports(object: any, method: Function, namespace: string = '') {
    if (!object) {
        return {}
    }

    const keys = Object.keys(object)
    const args = !namespace ? [keys] : [namespace, keys] as const

    return provideStoreInstance(method(...args))
}
