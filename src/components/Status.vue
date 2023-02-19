<script>
import { defineComponent } from "vue";
import { useBookingService } from "./bookingMachine.js";
import dayjs from "dayjs/esm/index.js";

export default defineComponent({
	name: "Status",
	computed: {
		now: function (){
			if (this.state.context.status && this.state.context.status.hasOwnProperty("now")){
			return dayjs(this.state.context.status.now).format("ddd DD MMM HH:mm")
			}
			},
	},
  setup() {
    const { state, send } = useBookingService();
    return {
      state,
      send,
    };
  },
});
</script>

<template>

  <template v-if="state.context.status.locked">

	
<div class="container-fluid">
   <div class="bg-danger row mb-2">

	 <div class="col-md-auto" >
	   
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6" width="15%" length="auto">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
</svg>

	 </div>

	 
<div class="col-8">
     <h4 class="text-white text-left"> {{ now }}  {{ state.context.status.message }} </h4>
	 </div>
 
</div>
 </div> 
  </template>
  <template v-else >
	
<div class="container-fluid">
   <div class="bg-success row mb-2">

	 <div class="col-md-auto" >
	   
	 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6" width="15%" length="auto">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
	 </svg>

	 </div>

	 
<div class="col-8">
     <h4 class="text-white text-left"> {{ now }}  {{ state.context.status.message }} </h4>
	 </div>
 
</div>
 </div> 
</template>
</template>
