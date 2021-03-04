import { GettersDef, StateDef } from '@/typings';

export function defineGetters<State extends StateDef, G extends GettersDef<State>>(state: State, getters: G): G {
    return getters;
}
