<template>
  <template v-if="current.value === 'pending'">
    <div>Pending...</div>
  </template>

  <template v-else-if="current.value  === 'timesUp'">
    <div> Time's Up!!</div>
  </template>

</template>
<script src="./ParentChild.js"></script>
