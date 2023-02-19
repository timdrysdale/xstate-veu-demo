import BookingSlot from "./BookingSlot.vue";
import { useBookingService } from "./bookingMachine.js";

export default {
  props: [],
  components: {
    BookingSlot,
  },
  computed: {
    slots() {
      return this.state.context.completeSlots;
    },
    filteredSlots() {
      var filter = this.filter.toLowerCase();
      var items = Object.entries(this.slots);

      //each item is an array with two elements [0] key and [1] object
      items.sort((a, b) => (a[0] > b[0] ? 1 : -1));

      if (filter == "") {
        return Object.fromEntries(items);
      }
      let results = items.filter((obj) => {
        return obj[1].description.name.toLowerCase().includes(filter);
      });

      return Object.fromEntries(results);
    },
  },
  data() {
    return {
      filter: "",
      disableRefresh: true,
    };
  },
  setup() {
    const { state, send } = useBookingService();
    return {
      state,
      send,
    };
  },
};
