import { useBookingService } from "./bookingMachine.js";

export default {
  props: ["response"],
  computed: {
    reason: function () {
      return this.response;
    },
    success: function () {
      return this.response;
    },
  },
  data() {
    return {};
  },
  methods: {
    back() {
      this.send("BACK");
      console.log("go back!");
    },
  },
  setup() {
    const { state, send } = useBookingService();
    return {
      state,
      send,
    };
  },
};
