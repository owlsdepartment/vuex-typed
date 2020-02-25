export interface Module<S, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods> {
    namespaced?: boolean,
    state?: S,
    getters?: G,
    mutations?: M,
    actions?: A,
    modules?: { [key: string]: Module<any, any, any, any> }
}

export interface CommitOptions {
    silent?: boolean;
    root?: boolean;
}

export interface DispatchOptions {
    root?: boolean;
}

export type ObjectWithMethods = { [k: string]: (...args: any[]) => any }
type SecondParam<T extends ObjectWithMethods, K extends keyof T> = Parameters<T[K]>[1]

interface Operation<O extends ObjectWithMethods, Opt> {
    <K extends keyof O, P extends SecondParam<O, K>>(payloadWithType: { type: K } & P, options?: Opt): void;
    <K extends keyof O, P extends SecondParam<O, K>>(type: K, payload: P, options?: Opt): void;
}

export interface Commit<O extends ObjectWithMethods> extends Operation<O, CommitOptions> { }

export interface Dispatch<O extends ObjectWithMethods> extends Operation<O, DispatchOptions> { }

export interface ActionContext<S, RS, G, RG, M extends ObjectWithMethods> {
    state: S,
    rootState: RS,
    getters: G,
    rootGetters: RG,
    commit: Commit<M>,
    dispatch: Dispatch<any>
}

export interface MappedModule<S, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods> {
    state: S,
    getters: MappedGetters<G>,
    mutations: MappedMutations<M>,
    actions: MappedActions<A>
}

type MappedGetters<T extends ObjectWithMethods> = { [K in keyof T]: ReturnType<T[K]> }

type MappedMutations<T extends ObjectWithMethods> = { [K in keyof T]: (payload: SecondParam<T, K>) => void }

type MappedActions<T extends ObjectWithMethods> = { [K in keyof T]: (payload: SecondParam<T, K>) => ReturnType<T[K]> }
