import { MutationsDef, StateDef } from '@/typings';

export function defineMutations<State extends StateDef, M extends MutationsDef<State>>(state: State, mutations: M): M {
    return mutations;
}