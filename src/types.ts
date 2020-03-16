/**
 * Overall module type. Probably no need to use it
 */
export interface Module<S, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods> {
    namespaced?: boolean,
    state?: S,
    getters?: G,
    mutations?: M,
    actions?: A,
    modules?: { [key: string]: Module<any, any, any, any> }
}

/**
 * Helper type to create vuex actions context object based on other moudle parts
 */
export interface ActionContext<S, RS, G, RG, M extends ObjectWithMethods> {
    state: S,
    rootState: RS,
    getters: G,
    rootGetters: RG,
    commit: Commit<M>,
    dispatch: Dispatch<any>
}

export interface Commit<O extends ObjectWithMethods> extends Operation<O, CommitOptions> { }

export interface Dispatch<O extends ObjectWithMethods> extends Operation<O, DispatchOptions, Promise<any>> { }

interface CommitOptions {
    silent?: boolean;
    root?: boolean;
}

interface DispatchOptions {
    root?: boolean;
}

interface Operation<O extends ObjectWithMethods, Opt, Ret = void> {
    <K extends keyof O, P extends OptionalSecondParam<O, K>>(type: K, payload: P, options?: Opt): Ret;
    (type: string, payload?: any, options?: Opt): Ret;
    <K extends keyof O, P extends OptionalSecondParam<O, K>>(payloadWithType: { type: K } & P, options?: Opt): Ret;
    (payloadWithType: { type: string } & Dictionary, options?: Opt): Ret;
}

/**
 * Mapping types
 */

export interface MappedModule<S extends State, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods> {
    state: MappedState<S>,
    getters: MappedGetters<G>,
    mutations: MappedMutations<M>,
    actions: MappedActions<A>
}

export type MappedState<S extends State> = {
    [K in keyof S]: () => S extends ((...args: any) => any)
        ? ReturnType<S>[K]
        : S[K]
}

export type MappedGetters<G extends ObjectWithMethods> = {
    [K in keyof G]: () => ReturnType<G[K]>
}

export type MappedMutations<M extends ObjectWithMethods> = {
    [K in keyof M]: (payload: OptionalSecondParam<M, K>) => void
}

export type MappedActions<A extends ObjectWithMethods> = {
    [K in keyof A]: <Ret = ReturnType<A[K]>>(
        payload: OptionalSecondParam<A, K>
    ) => Ret extends Promise<any> ? Ret : Promise<Ret>
}

export interface ObjectWithMethods {
    [k: string]: (...args: any[]) => any
}

export type State = object | (() => object)

interface Dictionary<T = any> {
    [key: string]: T
}

type SecondParam<T extends ObjectWithMethods, K extends keyof T> = Parameters<T[K]>[1]

type OptionalSecondParam<T extends ObjectWithMethods, K extends keyof T, O = SecondParam<T, K>> =
    O extends undefined ? void : O;
