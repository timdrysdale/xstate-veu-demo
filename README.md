# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Vuex and/or Xstate?

Both seems to be a halfway house, with [posters commenting they move onto XState only if they can refactor legacy code from vuex](https://dev.to/felix/replacing-vuex-with-xstate-3097) But don't use the event bus in the example because it is deprecated for vue3


## Front end can be a simple view layer

Logic can rest in the state machines.

The reddit example looks appropriate.

where each subreddit is instead a policy.

