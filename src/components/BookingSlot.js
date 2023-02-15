import dayjs from "dayjs/esm/index.js";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default {
  props: ["description", "available", "id", "service"], //, "available", "status"],
  computed: {
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
    nextBookable: function () {
      if (this.available.length < 1) {
        return "No free slots available to book.";
      }
      let start = dayjs(this.available[0].start);
      return "Available " + start.fromNow();
    },
  },
  methods: {
    makeBooking() {
      let id = this.id;
      this.service.send({ type: "BOOKING", value: id });
      console.log("go to booking for", this.id);
    },
  },
};
