import { ActionsDef, GettersDef, MutationsDef, ObjectWithMethods, StateDef } from "@/typings";

interface ModuleDef<
    State extends StateDef,
    Getters extends GettersDef<State>,
    Mutations extends MutationsDef<State>,
    Actions extends ObjectWithMethods = ActionsDef<State, Getters, Mutations>
> {
    namespaced?: boolean,
    state?: State,
    getters?: Getters,
    mutations?: Mutations,
    actions?: Actions,
}

export function defineModule<
    State extends StateDef,
    Getters extends GettersDef<State>,
    Mutations extends MutationsDef<State>,
    Actions extends ObjectWithMethods = ActionsDef<State, Getters, Mutations>
>(module: ModuleDef<State, Getters, Mutations, Actions>) {
    return module
}
