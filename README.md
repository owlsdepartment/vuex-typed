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

By using `ActionContext` and telling that first argument of method is of type `Ctx`, TypeScript knows what are module mutations, what is state type and what Getters are available and all of it is typed.

