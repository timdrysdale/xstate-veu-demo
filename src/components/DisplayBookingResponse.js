export default {
  props: ["service", "response"],
  computed: {
    reason: function () {
      return this.response;
    },
    success: function () {
      return this.response;
    },
  },
  data() {
    return {};
  },
  methods: {
    back() {
      this.service.send("BACK");
      console.log("go back!");
    },
  },
};
