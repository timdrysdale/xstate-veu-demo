import dayjs from "dayjs/esm/index.js";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default {
  props: ["booking", "context"],
  computed: {
    description: function () {
      return this.context.slots[this.booking.slot].description;
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
      let id = this.booking.name;
      this.service.send({ type: "ACTIVITY", value: id });
      console.log("get activity for booking", id, this.booking.slot.id);
    },
    cancelBooking() {
      let id = this.booking.name;
      this.service.send({ type: "CANCELBOOKING", value: id });
    },
  },
};
