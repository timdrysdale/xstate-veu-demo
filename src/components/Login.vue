<template>
  <template v-if="current.value === 'pending'">
    <div>Pending...</div>
  </template>

  <template v-else-if="current.value  === 'loginDone'">
	<div> UserLocal: {{ context.userLocal }} </div>
    <div> UserRemote: {{ context.userRemote }} </div>
	<div> UserName: {{ context.userName }} </div>
	<div> Token: {{ context.token }} </div>
	<div> Groups: {{ context.groups.results.groups }} </div>	
  </template>

</template>
<script src="./Login.js"></script>
