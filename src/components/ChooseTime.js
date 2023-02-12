import dayjs from "dayjs/esm/index.js";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default {
  props: ["service", "slot"], //, "available", "status"],
  computed: {
    title: function () {
      return this.slot.description.name;
    },
    image: function () {
      return this.slot.description.image;
    },
    what: function () {
      return this.slot.description.short;
    },
    about: function () {
      return this.slot.description.long;
    },
    link: function () {
      return this.slot.description.further;
    },
    nextBookable: function () {
      if (this.slot.available.length < 0) {
        return "All available slots booked for just now, please check again later";
      }
      let start = dayjs(this.slot.available[0].start);
      return "Available " + start.fromNow();
    },
  },
  methods: {
    goBack() {
      this.service.send("BACK");
      console.log("go back to catalogue");
    },
    makeBooking() {
      this.service.send({ type: "REQUESTBOOKING", value: this.slot.id });
      console.log("go to booking for", this.id);
    },
  },
};
