<template>
  <template v-if="current.value === 'login'">
    <div>Logging in ...</div>
  </template> 
  <template v-if="current.value === 'bookings'">
    <div>Getting bookings ...</div>
  </template>
  <template v-if="current.value === 'idle'">  
    <div> Your groups {{ context.groups }}.</div>
	<div> Your bookings {{ context.bookings }}.</div>
	<button @click="send({type:'SELECT',name:'g-everyone'})">Get g-everyone details</button>
  </template>
  <template v-if="current.value === 'selected'">  
    <div> Your groups {{ context.groups }}.</div>
	<div> Your bookings {{ context.bookings }}.</div>
	<div> g-a selected: {{ context.groupDetails}} </div>

  </template>
  <template v-if="current.value === 'displayGroup'">
	<div> user: {{ context.userName }} </div>
	<div> token: {{ context.token }} </div>
    <div> Your groups {{ context.groups }}.</div>
	<div> Your bookings {{ context.bookings }}.</div>
	<div> g-everyone selected: {{ context.groupDetails}} </div>

  </template>
</template>
<script src="./bookingMachine.js"></script>
