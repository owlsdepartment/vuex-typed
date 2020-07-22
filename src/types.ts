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
export interface ActionContext<
    State extends StateDef = any,
    Getters extends ObjectWithMethods = any,
    Mutations extends ObjectWithMethods = any,
    RootState extends StateDef = any,
    RootGetters extends ObjectWithMethods = any
> {
    state: ExtractState<State>,
    getters: ExtractGetter<Getters>,
    rootState: ExtractState<RootState>,
    rootGetters: ExtractGetter<RootGetters>,
    commit: Commit<Mutations>,
    dispatch: Dispatch<any>
}

export interface ActionContextDeprecated<
    State extends StateDef = any,
    RootState extends StateDef = any,
    Getters extends ObjectWithMethods = any,
    RootGetters extends ObjectWithMethods = any,
    Mutations extends ObjectWithMethods = any
> {
    state: ExtractState<State>,
    getters: ExtractGetter<Getters>,
    rootState: ExtractState<RootState>,
    rootGetters: ExtractGetter<RootGetters>,
    commit: Commit<Mutations>,
    dispatch: Dispatch<any>
}

export type ExtractGetter<Getter extends ObjectWithMethods> = {
    [K in keyof Getter]: ReturnType<Getter[K]>
}

export interface Commit<O extends ObjectWithMethods> extends Operation<O, CommitOptions> { }

export interface Dispatch<O extends ObjectWithMethods> extends Operation<O, DispatchOptions, Promise<any>> { }

interface CommitOptions extends Options {
    silent?: boolean;
}

interface DispatchOptions extends Options { }

interface Options {
    root?: boolean;
}

interface Operation<O extends ObjectWithMethods, Opt extends Options, Ret = void> {
    <K extends keyof O>(type: K, payload?: OptionalSecondParam<O, K>, options?: Opt): Ret;
    (type: string, payload: any, options: Opt & { root: true }): Ret;
    <K extends keyof O>(payloadWithType: { type: K } & OptionalSecondParam<O, K>, options?: Opt): Ret;
    (payloadWithType: { type: string } & object, options: Opt & { root: true }): Ret;
}

/**
 * Mapping types
 */

export interface MappedModule<S extends StateDef, G extends ObjectWithMethods, M extends ObjectWithMethods, A extends ObjectWithMethods> {
    state: MappedState<S>,
    getters: MappedGetters<G>,
    mutations: MappedMutations<M>,
    actions: MappedActions<A>
}

export type MappedState<S extends StateDef, Out = ExtractState<S>> = {
    [K in keyof Out]: () => Out[K]
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

export type StateDef = object | (() => object)

type ExtractState<S extends StateDef> = S extends (() => object) ? ReturnType<S> : S

type SecondParam<T extends ObjectWithMethods, K extends keyof T> = Parameters<T[K]>[1]

type OptionalSecondParam<T extends ObjectWithMethods, K extends keyof T, O = SecondParam<T, K>> =
    O extends undefined ? void : O;
