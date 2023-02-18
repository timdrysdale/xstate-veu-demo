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
	
	<your-bookings
	  :context="context"
	  :bookings="context.bookings"
	  :service="BookingService">
	</your-bookings>
	
	<booking-slots
	  :slots="context.completeSlots"
	  :service="BookingService">
	</booking-slots>
  	
  </template> 
  <template v-if="current.value === 'booking'">
<!--	Make a booking here for {{ context.slotSelected }}
	{{ context.completeSlots[context.slotSelected] }}-->
	<choose-time
	  :service="BookingService"
	  :slot="context.completeSlots[context.slotSelected]">
	  </choose-time>
  </template>

   <template v-if="current.value === 'bookingResponse'">
<!--	Make a booking here for {{ context.slotSelected }}
	{{ context.completeSlots[context.slotSelected] }}-->
	<display-booking-response
	  :service="BookingService"
	  :response="context.bookingResponse">
	  </display-booking-response>
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
