import dayjs from "dayjs/esm/index.js";
import { ref } from "vue";
import relativeTime from "dayjs/plugin/relativeTime";
import { useBookingService } from "./bookingMachine.js";
dayjs.extend(relativeTime);

export default {
  props: ["booking"],
  computed: {
    description: function () {
      if (this.booking) {
        if (this.booking.slot) {
          if (this.state.context.slots[this.booking.slot]) {
            return this.state.context.slots[this.booking.slot].description;
          }
        }
      }
    },
    bookingNotStarted: function () {
      if (this.booking) {
        return dayjs().isBefore(this.start);
      }
    },
    title: function () {
      if (this.description) {
        return this.description.name;
      }
    },
    image: function () {
      if (this.description) {
        return this.description.image;
      }
    },
    what: function () {
      if (this.description) {
        return this.description.short;
      }
    },
    about: function () {
      if (this.description) {
        return this.description.long;
      }
    },
    link: function () {
      if (this.description) {
        return this.description.further;
      }
    },
    start: function () {
      if (this.booking) {
        return dayjs(this.booking.when.start);
      }
    },
    end: function () {
      if (this.booking) {
        return dayjs(this.booking.when.end);
      }
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

      var path = "/activity/" + this.booking.name;
      this.$router.push({ path: path });
    },

    cancelBooking() {
      // TODO have this open a separate routing to a cancel confirmation dialog (instead of a modal)
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
