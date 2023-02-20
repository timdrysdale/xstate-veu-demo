<script>
import { defineComponent } from "vue";
import { useBookingService } from "./bookingMachine.js";
import { useRoute } from 'vue-router';

export default defineComponent({
name: "StartUp",
components: {},
computed: {},
mounted() {

console.log(this.route.query)

const sg = {
groupNames: [this.route.query.groups],
sessionNames: [this.route.query.sessions],
}

console.log(sg)

this.send({type:"STARTUP", data: sg})

console.log("sent event")
},
  setup() {
const { state, send } = useBookingService();
const route =   useRoute();
    return {
      state,
send,
route,
    };
  },
});
</script>



<template >
  <div>
  Groups: {{ state.context.groupNames }}
  Sessions: {{ state.context.sessionNames }}
  </div>
</template>

