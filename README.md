# Vuex Typed
Package to help typing Vuex using TypeScript, also in components!

To add id to project
```
npm install --save vuex-typed

// or if you use yarn

yarn add vuex-typed
```

## Usage in store

In types suggested by Vue, you have typings for functions arguments, but you loose knowledge about functions names.

This typings force you to type function signature by your own, but you gain typings in module AND in components.

This is how you would do it:

```typescript
// State

export const state = {
  darkMode: false,
  entries: {} as { [key: string]: Entry },
  openModals: {} as { [key: string]: boolean }
}

export type GlobalState = typeof state

// Getters

export const getters = {
  darkMode: (state: GlobalState) => state.darkMode,

  allEntries: ({ entries }: GlobalState) => Object.values(entries),

  amountOfOpenModals: ({ openModals }: GlobalState) => Object.values(openModals).reduce((prev, curr) => {
    return curr ? prev + 1 : prev
  }, 0)
}

export type GlobalGetters = typeof getters

// Mutations

export const mutations = {
  SET_DARK_MODE(state: GlobalState, active: boolean) {
    state.darkMode = active
  },

  SET_ENTRY({ entries }: GlobalState, { entry }: { entry: Entry }) {
    Vue.set(entries, entry.id, entry)
  },

  REMOVE_ENTRY({ entries }: GlobalState, id: number) {
    Vue.delete(entries, id)
  },

  OPEN_MODAL({ openModals }: GlobalState, name: string) {
    Vue.set(openModals, name, true)
  },

  CLOSE_MODAL({ openModals }: GlobalState, name: string) {
    Vue.delete(openModals, name)
  }
}

export type GlobalMutations = typeof mutations

```

As you can see, you don't use anything from library, not yet! Fun begin in actions

```typescript
// Actions

import { ActionContext } from 'vuex-typed'

type Ctx = ActionContext<GlobalState, RootState, GlobalGetters, any, GlobalMutations>

export const actions = {
  async fetchEntries({ commit }: Ctx, projectId: number) {
    console.log(`Fetching entries for project ${projectId}`)

    await new Promise(resolve => setTimeout(resolve, 500))

    const response: Entry[] = [
      { id: 0, name: 'AEntry' },
      { id: 1, name: 'BEntry' },
      { id: 2, name: 'CEntry', optional: { configurable: true } },
      { id: 3, name: 'AEntry', optional: { configurable: true } }
    ]

    commit('SET_ENTRIES', response)

    return response
  }
}

export type GlobalActions = typeof actions

```

By using `ActionContext` and specifying that first argument of method is of type `Ctx`, TypeScript knows what are module mutations, what is state type and what Getters are available, and all of it is typed.

Action Context signature

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

Then we can wrap a whole module like this:

```typescirpt
import { state } from './state'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

const global = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

export default global
```

## Exposing to components

Having all of module parts typed, makes it possible to expose it for components as also typed.
We can achieve it by using `mapModule` helper. Under the hood, it uses Vuex's `mapState`, `mapGetters`, `mapMutations` and `mapActions`.

```typescirpt
export const { state, getters, mutations, actions } = mapModule(global, 'global')
```

Then in component we can just import it like this:

```vue
<template>
  <div class="wrapper">
    {{ allEntries }}
  
    <button type="button" @click="toggleDarkMode">
      Toggle Dark Mode
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { actions, mutations, getters } from '@/store/modules/global/helpers'

// to just tak specific parts you can destructure it
const { fetchEntries } = actions
const { SET_DARK_MODE } = mutations

export default Vue.extend({
  computed: {
    // to take all, just spread it
    ...getters
  },

  mounted() {
    this.fetchEntries(0)
  },

  methods: {
    fetchEntries,
    SET_DARK_MODE,
    
    toggleDarkMode() {
      this.SET_DARK_MODE(!this.darkMode)
    }
  }
})
</script>
```

`mapModule` signature:

```typescript
function mapModule<State, Getters, Mutations, Actions>(
  module: Module<State, Getters, Mutations, Actions>,
  namespace: string = ''
): MappedModule<State, Getters, Mutations, Actions>
```
