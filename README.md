# Vuex Typed
Package to help typing Vuex using TypeScript, also in components!

To add id to project
```
npm install @owlsdepartment/vuex-typed

// or if you use yarn

yarn add @owlsdepartment/vuex-typed
```

## Usage in store

In types suggested by Vue, you have typings for functions arguments, but you loose knowledge about functions names.

This typings force you to type function signature by your own, but you gain typings in module AND in components.

Minimal example:

```typescript
// State

export const state = {
  entries: {} as { [key: string]: Entry }
}

export type GlobalState = typeof state

// Getters

export const getters = {
  allEntries: ({ entries }: GlobalState) => Object.values(entries)
}

export type GlobalGetters = typeof getters

// Mutations

export const mutations = {
  SET_ENTRIES({ entries }: GlobalState, newEntries: Entry[]) {
    for (let entry of newEntries) {
      Vue.set(entries, entry.id, entry)
    }
  }
}

export type GlobalMutations = typeof mutations

// Actions
import { ActionContext } from '@owlsdepartment/vuex-typed'

// Helper type built based on other parts of module. Context object is almost fully typed with it
// expect dispatch and root commits
type Ctx = ActionContext<GlobalState, RootState, GlobalGetters, any, GlobalMutations>

export const actions = {
  async fetchEntries({ commit }: Ctx, projectId: number) {
    console.log(`Fetching entries for project ${projectId}`)

    // simulating async call
    await new Promise(resolve => setTimeout(resolve, 500))

    // some entries
    const response: Entry[] = [
      { id: 0, name: 'AEntry' },
      { id: 1, name: 'BEntry' },
      { id: 2, name: 'CEntry', optional: { configurable: true } },
      { id: 3, name: 'AEntry', optional: { configurable: true } }
    ]

    // typed commit
    commit('SET_ENTRIES', response)

    return response
  }
}

export type GlobalActions = typeof actions

// Module

export const global = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
```

By using `ActionContext` (generic type from library) and specifying that first argument of method is of type `Ctx`, TypeScript knows what are module mutations, what is state type and what Getters are available, and all of it is typed.

## Exposing module as seperate imports for other parts of application

With strongly typed store, it would be a shame to loose it in components. That's why there are special methods, that make it possible.

To properly setup library, you need to register store in `store` file or `main` using method `registerStore`.

```typescript
import { registerStore } from '@owlsdepartment/vuex-typed'
import store from './store'

registerStore(store)
```

Now you can expose state, actions, mutations and getters. Using previouse `store` example:
```typescript
// state.ts
export const { entries } = getState(state, 'global')

// getters.ts
export const { allEntries } = getGetters(getters, 'global')

// mutations.ts
export const { SET_ENTRIES } = getMutations(mutations, 'global')

// actions.ts
export const { fetchEntries } = getActions(actions, 'global')

```
Or whole module at once
```typescript
export const { state, getters, mutations, actions } = getModuleImports(global, 'global')
```

Every method expects object as first argument (or method in case of `getState`) and optional `namespace` as a second argument in case of namespaced modules.

All `getXXX` methods uses Vuex's `mapState`, `mapGetters`, `mapMutations` and `mapActions` under the hood.

Usage example in Vue component:

```vue
<template>
  <!-- some template -->
</template>

<script lang="ts">
import Vue from 'vue'
import { fetchEntries } from '@/store/modules/global/actions'
import { SET_ENTRIES } from '@/store/modules/global/mutations'
import { allEntries } from '@/store/modules/global/getters'
import { state as globalState } from '@/store/module/global'

export default Vue.extend({
  computed: {
    // spread whole state
    ...globalState,

    // if you want to expose getter of state to template, you need to use it in computed...
    allEntries,
  },

  mounted() {
    // ...but if you just use it inside <script>, there's no need for that
    fetchEntries(0)
  },

  methods: {
    removeAll() {
      SET_ENTRIES([])
    }
  }
})
</script>
```

Usage example in normal `.ts/.js` file:
```typescript
import { fetchEntries } from '@/store/modules/global/actions'
import { allEntries } from '@/store/modules/global/getters'

const onUserLogin = () => {
  if (allEntries().length === 0) {
    fetchEntries()
  }
}
```

## API

### ActionContext signature

```typescript
export interface ActionContext<State, RootState, Getters, RootGetters, Mutations> {
  state: State,
  rootState: RootState,
  getters: Getters,
  rootGetters: RootGetters,
  commit: Commit<Mutations>,
  dispatch: Dispatch<any>
}
```
If you don't want some Generics to be typed, just pass any.

### getModuleImports

```typescript
function mapModule<State, Getters, Mutations, Actions>(
  module: Module<State, Getters, Mutations, Actions>,
  namespace: string = ''
): MappedModule<State, Getters, Mutations, Actions>
```

### getState

```typescript
function getState<State extends object | (() => object)>(state: State, namespace: string = ''): MappedState<State>
```

### getMutations

```typescript
function getMutations<Mutations>(mutations: Mutations, namespace: string = ''): MappedMutations<Mutations>
```

### getGetters

```typescript
function getGetters<Getters>(getters: Getters, namespace: string = ''): MappedGetters<Getters>
```

### getActions

```typescript
function getActions<Actions>(actions: Actions, namespace: string = ''): MappedActions<Actions>
```

## Project Status

Project is new and maintained. And feedback, questions and issues are appreciated.
