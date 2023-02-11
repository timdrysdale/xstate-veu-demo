<template>
  <template v-if="current.value === 'login'">
    <div>Logging in ...</div>
  </template> 
  <template v-if="current.value === 'bookings'">
    <div>Getting bookings ...</div>
  </template>
  <template v-if="current.value === 'notused'">  
    <div> Your groups {{ context.groups }}.</div>
	<div> Your bookings {{ context.bookings }}.</div>
	<button @click="send({type:'SELECT',name:'g-everyone'})">Get g-everyone details</button>
  </template>

  <template v-if="current.value === 'groups'">
<h4> Your bookings:  </h4>
	<div> Your bookings {{ context.bookings }}</div>
    <h4> Your groups:  </h4>
	<li v-for="group in context.groups">
	  {{ group.description.name }} : {{ group.description.short }}
	</li>
  </template>

  <template v-if="current.value === 'idle'">
	{{ context }}
<h4> Your bookings:  </h4>
	<div> Your bookings {{ context.bookings }}</div>
    <h4> Your groups:  </h4>
	<li v-for="group in context.groups">
	  {{ group.description.name }} : {{ group.description.short }}
	</li>
	<h4> Your policies </h4>
	<li v-for="policy in context.policies">
	  {{ policy.description.name }} : {{ policy.description.short }}
	</li>	
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
