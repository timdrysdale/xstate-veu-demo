<template>
  <template v-if="current.value === 'pending'">
    <div>Pending...</div>
  </template>

  <template v-else-if="current.value  === 'timesUp'">
    <div> Done: {{ context.userResult }} {{ context.userResults.user_name}}</div>
	<div> Done: {{ context.loginResult }} {{ context.loginResults.token }}</div>
  </template>

</template>
<script src="./Login.js"></script>
