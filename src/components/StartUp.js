import { defineComponent } from "vue";
import { useBookingService } from "./bookingMachine.js";

export default defineComponent({
  name: "StartUp",
  computed: {},
  setup() {
    const { state, send } = useBookingService();
    return {
      state,
      send,
    };
  },
});
