import { ObjectWithMethods, ExtractGetter, Commit, Dispatch } from './types'

export type StateDef = object | (() => object)

export type ExtractState<S extends StateDef> = S extends (() => object)
    ? ReturnType<S>
    : S

export type GettersDef<State extends StateDef> = {
    [key: string]: (state: ExtractState<State>, getters: Record<string, any>, rootState: Record<string, any>, rootGetters: Record<string, any>) => any
}

export type MutationsDef<State extends StateDef> = {
    [key: string]: (state: ExtractState<State>, ...args: any[]) => void
}

export type ActionsDef<
    State extends StateDef = StateDef,
    Getters extends GettersDef<State> = ObjectWithMethods,
    Mutations extends MutationsDef<State> = ObjectWithMethods,
    RootState extends StateDef = StateDef,
    RootGetters extends GettersDef<RootState> = ObjectWithMethods
> = {
    [key: string]: (
        context: ActionContext<State, Getters, Mutations, RootState, RootGetters>,
        ...args: any[]
    ) => any
}

/**
 * Helper type to create vuex actions context object based on other moudle parts
 */
export interface ActionContext<
    State extends StateDef = StateDef,
    Getters extends GettersDef<State> = ObjectWithMethods,
    Mutations extends MutationsDef<State> = ObjectWithMethods,
    RootState extends StateDef = StateDef,
    RootGetters extends GettersDef<RootState> = ObjectWithMethods
> {
    state: ExtractState<State>,
    getters: ExtractGetter<Getters>,
    rootState: ExtractState<RootState>,
    rootGetters: ExtractGetter<RootGetters>,
    commit: Commit<Mutations>,
    dispatch: Dispatch<ObjectWithMethods>
}


export interface ModuleDef<
    State extends StateDef = any,
    Getters extends ObjectWithMethods = any,
    Mutations extends ObjectWithMethods = any,
    Actions extends ObjectWithMethods = ActionsDef<State, Getters, Mutations>,
    Modules extends Record<string, ModuleDef> = any,
> {
    namespaced?: boolean,
    state?: State,
    getters?: Getters,
    mutations?: Mutations,
    actions?: Actions,
    modules?: Modules
}

/**
 * @deprecated use `ActionContext` insted
 */
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
    dispatch: Dispatch<ObjectWithMethods>
}
