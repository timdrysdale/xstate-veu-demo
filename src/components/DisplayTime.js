import dayjs from "dayjs/esm/index.js";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default {
  props: ["service", "slot", "time"],
  computed: {
    start: function () {
      return this.time.start;
    },
    end: function () {
      return this.time.end;
    },
  },
  data() {
    return {};
  },
  methods: {
    makeBooking() {
      let booking = {
        id: this.slot.id,
        start: this.start.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        end: this.end.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      };
      this.service.send({ type: "REQUESTBOOKING", value: booking });
      console.log("request booking for", booking, this.start, this.end);
    },
  },
};
