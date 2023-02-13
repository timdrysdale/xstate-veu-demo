import DisplayTimes from "./DisplayTimes.vue";
import dayjs from "dayjs/esm/index.js";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default {
  props: ["service", "slot"], //, "available", "status"],
  components: {
    DisplayTimes,
  },
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
    suggested: function () {
      let all = {};

      for (const name in this.slot.policyDetails.display_guides) {
        // convert into ISO8601 format
        console.log("suggested for display_guide", name);

        const guide = this.slot.policyDetails.display_guides[name];

        const ds = "PT" + guide.duration.toUpperCase();
        const duration = dayjs.duration(ds);
        console.log(ds, duration);
        let list = [];

        if (this.slot.available.length > 0) {
          this.slot.available.forEach(function (window, index) {
            let windowStart = dayjs(window.start);
            let windowEnd = dayjs(window.end);
            let now = dayjs();
            let suggestedStart = windowStart;
            if (windowStart.isSameOrBefore(now)) {
              suggestedStart = now;
            }
            let suggestedEnd = windowStart.add(duration);

            while (
              suggestedEnd.isSameOrBefore(windowEnd) &&
              list.length < guide.max_slots
            ) {
              list.push({ start: suggestedStart, end: suggestedEnd });
              suggestedStart = suggestedStart.add(duration);
              suggestedEnd = suggestedEnd.add(duration);
            }
          });

          all[guide.label] = list;
        }
      }
      return all;
    },
  },
  data() {
    return {
      start: "",
      end: "",
    };
  },
  methods: {
    goBack() {
      this.service.send("BACK");
      console.log("go back to catalogue");
    },
    makeBooking() {
      let booking = {
        id: this.slot.id,
        start: this.start,
        end: this.end,
      };
      this.service.send({ type: "REQUESTBOOKING", value: booking });
      console.log("request booking for", booking);
    },
  },
};
