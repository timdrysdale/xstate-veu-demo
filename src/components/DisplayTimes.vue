<template>
  <div class="row">
{{ duration }}
	
<display-time 
  v-for="(time,key) in times"
  :key="key"
  :service="service"
  :slot="slot"
  :time="time">
</display-time>
</div>

</template>
<script src="./DisplayTimes.js"></script>
