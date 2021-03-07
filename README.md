# Vuex Typed

Fully integrate TypeScript with Vuex, also in components, with little to none additional type annotations!

---

## Instalation

To install library to project
```bash
# using yarn
yarn add @owlsdepartment/vuex-typed

# using npm
npm install --save @owlsdepartment/vuex-typed
```

To enable import helpers

```typescript
// in store.ts or main.ts

import { registerStore } from '@owlsdepartment/vuex-typed'
import store from './store'

// pass global store instance
registerStore(store)
```

_**Sidenote:** Currently library supports only one Vuex instance in whole project. This could be changed if there would ever be such need._

---

## Motivations

In types suggested by Vue, you need to specify Vuex structure twice: as a type and as an implementation, which can feel like you double yourself and you loose type information in components.

This typings force you to type function signature by your own, either fully or partially using `defineXXX` methods, but you gain typings in module AND in components.

### _**I'm using Vuex with JavaScript, should I still care about it and use it?**_

If you want help from your IDE, than yes, totally! This library is written in TS, but can be used in JS projects, as you will get benefits of intellisens.

---

# Usage guide

Library splits to to independent parts:
 * **defining store parts using `defineXXX`**
 * **creating exports for components using `getXXX`**

## Defining Vuex

In medium or large Vuex applications, you will probably use modules. Even if not, root state is also a module.

Modules consist of 4 parts:
 * `state`
 * `getters` | depends on `state`
 * `mutations` | depends on `state`
 * `actions` | depends on `state`, `mutations` and `getters`

There are 3 ways you could write your module:
1. all parts in one file and one object
2. all parts in one file but in seperate variables, that you then merge in a single object
3. all parts in seperate files

In bigger projects, we suggest using 3rd option, in smaller ones, the 2nd one.

There are 4 helpers, to help you define module and access benefits of types:
 * `defineGetters`
 * `defineMutations`
 * `defineActions`
 * `defineModule`

Let's look at the examples of the same module `post`, declared in a 3 ways!

### 1. All in one file

```typescript
interface Post {
  id: number;
  author: string;
  text: string;
}

const module = defineModule({
  state: {
    posts: Post[],
    // let's store `id` of a main post
    mainPost: null as number | null
  },

  getters: {
    // 👇 no need to annotate state type
    getPostById: state => (id: number) => {
      return state.posts.find(post => post.id === id)
    },

    getMainPost: (state, getters) => {
      // unfortunately, getters cannot self reference
      // so they are typed as any
      const { mainPost } = state

      return mainPost ? getters.getPostById(mainPost) : null
    }
  },

  mutations: {
    // 👇 no need to annotate state type
    postsFetched(state, newPosts: Post[]) {
      this.posts = [...newPosts]
    }
  },

  actions: {
    // 👇 no need to annotate first argument
    // but it's typed mostly as any
    fetchPosts({ commit }) {
      const newPosts = /* some api call */

      commit('postsFetched', newPosts)
    }
  }
})
```

**Pros:**
 * all definitions in one object
 * partially typed signature for getters and mutations

**Cons:**
 * `state`, `getters` and `mutations` are typed as any for `actions` 

### 2. All in one file, but in seperate variables

```typescript
interface Post {
  id: number;
  author: string;
  text: string;
}

const state = defineState({
  posts: Post[],
  // let's store `id` of a main post
  mainPost: null as number | null
})

// 👇 we are passing state as a parameter, only for getting proper type
const getters = defineGetters(state, {
  // 👇 no need to annotate state type
  getPostById: state => (id: number) => {
    return state.posts.find(post => post.id === id)
  },

  // 👇 no need to annotate state type
  getMainPost: (state, getters) => {
    // unfortunately, getters cannot self reference
    // so they are typed as any
    const { mainPost } = state

    return mainPost ? getters.getPostById(mainPost) : null
  }
})

// 👇 we are passing state as a parameter, only for getting proper type
const mutations = defineMutations(state, {
  // 👇 no need to annotate state type
  postsFetched(state, newPosts: Post[]) {
    this.posts = [...newPosts]
  }
})

const actions = defineActions(state, getters, mutations, {
  // 👇 action first param is fully typed!
  fetchPosts({ commit, getters }) {
    const newPosts = /* some api call */

    // ✅ fully typed commit
    commit('postsFetched', newPosts)
    // ❌ TYPO! there is no such mutation, so TS will complain about first argument
    commit('postFetche', newPosts)
    // ✅ if we want, getters are also fully typed
    getters.posts
  }
})
```

**Pros:**
 * all definitions in seperate objects, we got more control
 * every part of module is fully typed!

**Cons:**
 * few code lines more

### 3. All in seperate files

Nearly same as example above, but with file seperation

```typescript
// state.ts
const state = defineState({
  // ...
})

export default state

// getters.ts
import state from './state'

const getters = defineGetters(state, {
  // ...
})

export default getters

// mutations.ts
import state from './state'

const mutations = defineMutations(state, {
  // ...
})

export default mutations

// actions.ts
import state from './state'
import getters from './getters'
import mutations from './mutations'

const actions = defineActions(state, getters, mutations, {
  // ...
})

export default actions
```

**Pros:**
 * all definitions in seperate objects and seperate files
 * more control
 * better seperation
 * better readability
 * every part of module is fully typed!

**Cons:**
 * few code lines more
 * more files to maintain
 * in smaller projects, can be overwhelming

---

**NOTE:**

`defineActions` have 3 signatures:
```typescript
// using only state
defineActions(state, { /*actions*/ })

// using state and getters
defineActions(state, getters, { /*actions*/ })

// using all
defineActions(state, getters, mutations, { /*actions*/ })

// if you have only state and mutations
defineActions(state, {}, mutations, { /*actions*/ })
```

## Creating exports

---

**IMPORTANT!**

_With usage of `get` helpers, we recommend adding webpack plugin to detect and avoid circular dependencies, like [circular-dependency-plugin](https://www.npmjs.com/package/circular-dependency-plugin), as it may stop working if there are any circular dependencies._

---

With strongly typed store, it would be a shame to lose it in components. That's why there are special methods, that make it possible.

To properly setup library, you need to register store in `store` file or `main` using method `registerStore`, as mentioned on the beginning.

```typescript
import { registerStore } from '@owlsdepartment/vuex-typed'
import store from './store'

registerStore(store)
```

Now you can expose state, actions, mutations and getters.

Using previouse `store` example:
```typescript
// state.ts
export const rootState = getState(state)

// getters.ts
export const rootGetters = getGetters(getters)

// mutations.ts
export const rootMutations = getMutations(mutations)

// actions.ts
export const rootActions = getActions(actions)
```

Or whole module at once

```typescript
export const {
  state: rootState,
  getters: rootGetters,
  mutations: rootMutations,
  actions: rootActions
} = getModuleImports(store)
```

In case of namespaced module:

```typescript
// post/state.ts
export const postState = getState(state, /*namespace*/ 'post')

// post/getters.ts
export const postGetters = getGetters(getters, /*namespace*/ 'post')

// post/mutations.ts
export const postMutations = getMutations(mutations, /*namespace*/ 'post')

// post/actions.ts
export const postActions = getActions(actions, /*namespace*/ 'post')

// or whole module
// post/index.ts
export const {
  state: postState,
  getters: postGetters,
  mutations: postMutations,
  actions: postActions
} = getModule(post, 'post')
```

Any of the exports can be desctructured using ES6 desctructuring notation to export only specific methods.

Every method expects object as first argument (or method in case of `getState`) and optional `namespace` as a second argument in case of namespaced modules.

All `getXXX` methods uses Vuex's `mapState`, `mapGetters`, `mapMutations` and `mapActions` under the hood.

Usage example in Vue component:

```vue
<template>
  <!-- some template -->
</template>

<script lang="ts">
import Vue from 'vue'
import {
  postState,
  postGetters,
  postMutations,
  postActions,
  // interface import
  Post
} from '@/store/modules/post'

export default Vue.extend({
  computed: {
    allPosts(): Post[] {
      // To get state value or getters value, you need to call it as a method, but don't worry, TS will warn you!
      return postState.posts()
    },

    // if you want to expose getter of state to template, you need to use it in computed...
    mainPost: postGetters.getMainPost,
  },

  mounted() {
    // ...but if you just use it inside <script>, there's no need for that
    postActions.fetchPosts()
  }
})
</script>
```

**NOTE:** Imported Vuex can be used also in normal TS files!

## Map helper

Objects created with `getXXX` has also a `map` method, that works just like `mapXXX` from base Vuex, but don't need module specified and, of course, is fully typed. `map` allows to extract only what you need and, if used with object as param, rename methods.

Example usage:
```vue
<template>
  <!-- some template -->
</template>

<script lang="ts">
import Vue from 'vue'
import { postGetters, postState } from '@/store/modules/post'

export default Vue.extend({
  computed: {
    // array notation
    ...postGetters.map(['getMainPost', 'getPostById']),
    // object notation with renaming!
    ...postState.map({
      allPosts: 'posts'
    })
  }
})
</script>
```

## API

You can also don't use `define` helpers and manually get specific part type and use it directly. As it is simple with `getters` and `mutations`, `actions` gets complicated, so we recommend using `ActionContext` helper to type first argument of actions like this:

```typescript
type Ctx = ActionContext<State, Getters, Mutations>

const actions = {
  apiCall({}: Ctx) {
    // data fetching
  }
}
```

### ActionContext signature

```typescript
export interface ActionContext<
    State = any,
    Getters = any,
    Mutations = any,
    RootState = any,
    RootGetters = any
> {
    state: ExtractState<State>,
    getters: ExtractGetter<Getters>,
    rootState: ExtractState<RootState>,
    rootGetters: ExtractGetter<RootGetters>,
    commit: Commit<Mutations>,
    dispatch: Dispatch<any>
}
```
If you don't want some Generics to be typed, just pass `any` or don't use them. All are typed as `any` by default.

__Deprecated__

This is deprecated `ActionContext` signature from version `v1.1.8`. In newer versions it is exposed as `ActionContextDeprecated`:

```typescript
export interface ActionContext<
    State = any,
    RootState = any,
    Getters = any,
    RootGetters = any,
    Mutations = any
> {
    state: ExtractState<State>,
    rootState: ExtractState<RootState>,
    getters: ExtractGetter<Getters>,
    rootGetters: ExtractGetter<RootGetters>,
    commit: Commit<Mutations>,
    dispatch: Dispatch<any>
}
```

## Project Status

Project is new and maintained. And feedback, questions and issues are appreciated.

## License

Library is under [MIT License](https://opensource.org/licenses/MIT)
