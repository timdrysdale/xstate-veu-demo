import dayjs from "dayjs/esm/index.js";
import { ref } from "vue";
import relativeTime from "dayjs/plugin/relativeTime";
import { useBookingService } from "./bookingMachine.js";
dayjs.extend(relativeTime);

export default {
  props: ["booking"],
  computed: {
    description: function () {
      return this.state.context.slots[this.booking.slot].description;
    },
    title: function () {
      return this.description.name;
    },
    image: function () {
      return this.description.image;
    },
    what: function () {
      return this.description.short;
    },
    about: function () {
      return this.description.long;
    },
    link: function () {
      return this.description.further;
    },
    start: function () {
      return dayjs(this.booking.when.start);
    },
    end: function () {
      return dayjs(this.booking.when.end);
    },
  },
  methods: {
    getActivity() {
      this.send({ type: "GETACTIVITY", value: this.booking });
      console.log(
        "get activity for booking",
        this.booking.name,
        this.booking.slot
      );
    },
    cancelBooking() {
      this.send({ type: "CANCELBOOKING", value: this.booking });
      console.log("cancel booking", this.booking.name, this.booking.slot);
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
