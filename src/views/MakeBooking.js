export default {
  name: "MakeBooking",
  components: {},
  data() {
    return {};
  },
  computed: {
    slot: function () {
      return this.$route.params.slot;
    },
  },
  methods: {
    goBack() {
      console.log("going back");
      this.$router.back();
    },
  },
  watch: {
    $route(to, from) {
      console.log("MakeBooking:", to, from);
    },
  },
};
