<template>
  <template v-if="current.value === 'pending'">
    <div>Pending...</div>
  </template>

  <template v-else-if="current.value  === 'timesUp'">
    <div> Done: {{ context.result }} {{ context.results.user_name }}</div>
  </template>

</template>
<script src="./SpawnFetch.js"></script>
