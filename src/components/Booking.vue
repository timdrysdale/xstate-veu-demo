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
  </template> 

</template>
<script src="./bookingMachine.js"></script>
