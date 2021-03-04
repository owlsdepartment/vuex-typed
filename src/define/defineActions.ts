import { ActionsDef, GettersDef, MutationsDef, StateDef } from '@/typings';
import { ObjectWithMethods } from '@/typings/types';

export function defineActions<
    State extends StateDef,
    A extends ActionsDef<State>
>(state: State, actions: A): A;

export function defineActions<
    State extends StateDef, 
    Getters extends GettersDef<State>,
    A extends ActionsDef<State, Getters>
>(state: State, getters: Getters, actions: A): A;

export function defineActions<
    State extends StateDef, 
    Getters extends GettersDef<State>,
    Mutations extends ObjectWithMethods,
    A extends ActionsDef<State, Getters, Mutations>
>(state: State, getters: Getters, mutations: Mutations, actions: A): A;

export function defineActions(state: any, getters: any, mutations?: any, actions?: any) {
    return actions ?? mutations ?? getters;
}
