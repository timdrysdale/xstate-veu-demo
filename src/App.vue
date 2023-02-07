<script setup>
  import FetchDemo from './components/FetchDemo.vue'
  import Toggle from './components/Toggle.vue'
  import ParentChild from './components/ParentChild.vue'
</script>

<template>
<FetchDemo />
<Toggle/>
<ParentChild />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
