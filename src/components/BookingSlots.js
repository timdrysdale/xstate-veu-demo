import BookingSlot from "./BookingSlot.vue";

export default {
  props: ["slots"],
  components: {
    BookingSlot,
  },
  computed: {
    filteredSlots() {
      var filter = this.filter.toLowerCase();
      var items = Object.entries(this.slots);

      //Object.fromEntries(Object.entries(obj).filter(([key]) => key.includes('Name')));
      console.log(items);

      //each item is an array with two elements [0] key and [1] object
      items.sort((a, b) => (a[0] > b[0] ? 1 : -1));

      if (filter == "") {
        return Object.fromEntries(items);
      }
      let results = items.filter((obj) => {
        return obj[1].description.name.toLowerCase().includes(filter);
      });

      return Object.fromEntries(results);
    },
  },
  data() {
    return {
      filter: "",
      disableRefresh: true,
    };
  },
};
