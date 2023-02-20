<script>
import { defineComponent } from "vue";
import { useBookingService } from "./bookingMachine.js";

export default defineComponent({
name: "StartUp",
components: {},
computed: {},
  setup() {
    const { state, send } = useBookingService();
    return {
      state,
      send,
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

