import { ActionsDef, GettersDef, MutationsDef, StateDef } from "@/typings";

interface ModuleDef<
    State extends StateDef,
    Getters extends GettersDef<State>,
    Mutations extends MutationsDef<State>,
> {
    namespaced?: boolean,
    state?: State,
    getters?: Getters,
    mutations?: Mutations,
    actions?: ActionsDef<State, Getters, Mutations>,
}

export function defineModule<
    State extends StateDef,
    Getters extends GettersDef<State>,
    Mutations extends MutationsDef<State>
>(module: ModuleDef<State, Getters, Mutations>) {
    return module
}
