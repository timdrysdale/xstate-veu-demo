import dayjs from "dayjs/esm/index.js";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default {
  props: ["description", "available", "id"], //, "available", "status"],
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
      if (this.available.length < 0) {
        return "All available slots booked for just now, please check again later";
      }
      let start = dayjs(this.available[0].start);
      return "Available " + start.fromNow();
    },
  },
  methods: {
    open() {
      var path = "/makebooking/" + this.id;
      this.$router.push({ path: path });
    },
  },
};
