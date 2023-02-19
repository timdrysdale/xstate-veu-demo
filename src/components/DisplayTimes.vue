<template>
  <div class="row">
	<h4 >{{ duration }} </h4>
	</div>
	<div>
<display-time 
  v-for="(time,key) in times"
  :key="key"
  :slot="slot"
  :time="time">
</display-time>
</div>

</template>
<script src="./DisplayTimes.js"></script>
