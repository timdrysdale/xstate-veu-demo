import dayjs from "dayjs/esm/index.js";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

export default {
  props: ["description", "available"], //, "available", "status"],
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
      let start = dayjs(this.available[0].start, "YYYY-MM-DDTHH:MM:ss.SSSZ");
      console.log(start);
      return "Available " + start.fromNow(); //this.available[0].start;
    },
  },
};

//2023-02-12T13:57:28.062Z
