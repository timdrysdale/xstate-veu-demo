import DescribeActivity from "./describeActivity.vue";
import DescribeInterface from "./DescribeInterface.vue";

export default {
  props: ["activity"],
  components: {
    DescribeActivity,
    DescribeInterface,
  },
  computed: {
    userinterfaces: function () {
      return this.activity.uis;
    },
    config: function () {
      return this.activity.config;
    },
    streams: function () {
      return this.activity.streams;
    },
    exp: function () {
      return this.activity.exp;
    },
    dataloaded: function () {
      return this.activity != {};
    },
  },
};
