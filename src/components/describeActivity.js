import dayjs from "dayjs";

export default {
  props: ["activity", "id"],
  computed: {
    title: function () {
      if (this.activity.hasOwnProperty("description")) {
        return this.activity.description.name;
      } else {
        return "";
      }
    },
    image: function () {
      if (this.activity.hasOwnProperty("description")) {
        return this.activity.description.image;
      } else {
        return "";
      }
    },
    what: function () {
      if (this.activity.hasOwnProperty("description")) {
        return this.activity.description.short;
      } else {
        return "";
      }
    },
    about: function () {
      if (this.activity.hasOwnProperty("description")) {
        return this.activity.description.long;
      } else {
        return "";
      }
    },
    status: function () {
      return "Now until " + dayjs.unix(this.activity.exp).format("h:mm A");
    },
    dataloaded: function () {
      return this.activity != {};
    },
  },
};
