<template>
  <template v-if="current.value === 'login'">
    <div>Logging in ...</div>
  </template> 
   <template v-if="current.value === 'loginDone'">
    <div> Your groups {{ context.groups }}.</div>
  </template> 

</template>
<script src="./bookingMachine.js"></script>
