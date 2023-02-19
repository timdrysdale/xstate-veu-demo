import DisplayTimes from "./DisplayTimes.vue";
import dayjs from "dayjs/esm/index.js";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useBookingService } from "./bookingMachine.js";
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
        console.log("suggested for display_guide", name, this.slot.available);

        const guide = this.slot.policyDetails.display_guides[name];

        const ds = "PT" + guide.duration.toUpperCase();
        const duration = dayjs.duration(ds);
        console.log(ds, duration);
        let list = [];
        let firstSlot = true;

        if (this.slot.available.length > 0) {
          this.slot.available.forEach(function (window, index) {
            //do a single slot of that duration starting now, if possible
            let windowStart = dayjs(window.start);
            let windowEnd = dayjs(window.end);
            let now = dayjs();
            let suggestedStart = windowStart;
            let suggestedEnd;
            if (windowStart.isSameOrBefore(now) && firstSlot) {
              suggestedStart = now;
              firstSlot = false; //only do one slot starting now, even if it can't be added to list
              suggestedEnd = suggestedStart.set("second", 0).add(duration);
              if (suggestedEnd.isSameOrBefore(windowEnd)) {
                list.push({ start: suggestedStart, end: suggestedEnd });
              }
            }
            // now prepare slots that start on the hour, and every duration thereafer
            // e.g. 0,15,30,45 min. If the current window is after the top of the hour,
            // just make sure not to add a slot that starts before the window

            suggestedStart = windowStart.set("minute", 0).set("second", 0);
            suggestedEnd = suggestedStart.add(duration);

            while (
              list.length < guide.max_slots &&
              suggestedEnd.isSameOrBefore(windowEnd)
            ) {
              if (
                windowStart.isSameOrBefore(suggestedStart) &&
                suggestedEnd.isSameOrBefore(windowEnd)
              ) {
                list.push({ start: suggestedStart, end: suggestedEnd });
              }
              suggestedStart = suggestedStart.add(duration);
              suggestedEnd = suggestedStart.add(duration);
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
      this.send("BACK");
      console.log("go back to catalogue");
    },
    makeBooking() {
      let booking = {
        id: this.slot.id,
        start: this.start,
        end: this.end,
      };
      this.send({ type: "REQUESTBOOKING", value: booking });
      console.log("request booking for", booking);
    },
  },
  setup() {
    const { state, send } = useBookingService();
    return {
      state,
      send,
    };
  },
};
