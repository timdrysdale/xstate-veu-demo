import {
  assign,
  createMachine,
  interpret,
  send,
  spawn,
  sendParent,
} from "xstate";

import aggregatePolicies from "./aggregatePolicies.js";
import aggregateSlots from "./aggregateSlots.js";
import completeSlots from "./completeSlots.js";
import fetchMachine from "./fetchMachine.js";
import getGroupDetails from "./getGroupDetails.js";
import getSlotAvailable from "./getSlotAvailable.js";
import loginMachine from "./loginMachine.js";

import BookingSlots from "./BookingSlots.vue";
import YourBookings from "./YourBookings.vue";

const bookingMachine = createMachine({
  id: "bookingMachine",
  initial: "login",
  context: {
    bookings: "",
    userName: "",
    token: "",
    groups: {}, //groups we can choose from (includes description)
    group: null, //name of currently selected group
    groupDetails: {}, //subMachines see https://xstate.js.org/docs/tutorials/reddit.html#spawning-subreddit-actors
    policies: {},
    slots: [],
    available: {},
    completeSlots: {},
    slotSelected: "",
  },
  states: {
    login: {
      invoke: {
        src: loginMachine,
        data: {
          defaultGroup: "g-everyone",
          secondGroup: "g-engdes1-lab", //TODO get from query rather than hardcoding
        },
        onDone: {
          target: "bookings",
          actions: assign({
            groups: (context, event) => {
              return event.data.groups;
            },
            token: (context, event) => {
              return event.data.token;
            },
            userName: (context, event) => {
              return event.data.userName;
            },
          }),
        },
        onError: {
          target: "terminated",
        },
      },
    },
    bookings: {
      invoke: {
        src: fetchMachine,
        data: {
          path: (context, event) =>
            import.meta.env.VITE_APP_BOOK_SERVER +
            "/api/v1/users/" +
            context.userName +
            "/bookings",
          method: "GET",
          token: (context, event) => context.token,
        },
        onDone: {
          target: "groups",
          actions: assign({
            bookings: (context, event) => {
              return event.data.results;
            },
          }),
        },
        onError: {
          target: "terminated",
        },
      },
    },
    groups: {
      invoke: {
        src: getGroupDetails,
        onDone: {
          target: "policies",
          actions: assign({
            groupDetails: (context, event) => {
              return event.data.groupDetails;
            },
          }),
        },
        onError: {
          target: "idle", //TODO figure out what to do here if error
        },
      },
    },
    policies: {
      invoke: {
        src: aggregatePolicies,
        onDone: {
          target: "slots",
          actions: assign({
            policies: (context, event) => {
              return event.data.policies;
            },
          }),
        },
        onError: {
          target: "idle", //TODO figure out what to do here if error
        },
      },
    },
    slots: {
      invoke: {
        src: aggregateSlots,
        onDone: {
          target: "available",
          actions: assign({
            slots: (context, event) => {
              return event.data.slots;
            },
          }),
        },
        onError: {
          target: "idle", //TODO figure out what to do here if error
        },
      },
    },
    available: {
      invoke: {
        src: getSlotAvailable,
        onDone: {
          target: "completeSlots",
          actions: assign({
            available: (context, event) => {
              return event.data.available;
            },
          }),
        },
        onError: {
          target: "idle", //TODO figure out what to do here if error
        },
      },
    },
    completeSlots: {
      invoke: {
        src: completeSlots,
        onDone: {
          target: "idle",
          actions: assign({
            completeSlots: (context, event) => {
              return event.data.slots;
            },
          }),
        },
        onError: {
          target: "idle", //TODO figure out what to do here if error
        },
      },
    },
    idle: {
      on: {
        BOOKING: {
          target: "booking",
          actions: assign({
            slotSelected: (context, event) => {
              return event.value; // note we are using send({type:"BOOKING",value:"someslot"})
            },
          }),
        },
      },
    },
    booking: {},

    selected: {
      invoke: {
        src: fetchMachine,
        data: {
          path: (context, event) =>
            import.meta.env.VITE_APP_BOOK_SERVER +
            "/api/v1/groups/" +
            context.group,
          method: "GET",
          token: (context, event) => context.token,
        },
        onDone: {
          target: "displayGroup",
          actions: assign({
            groupDetails: (context, event) => {
              return event.data;
            },
          }),
        },
        onError: {
          target: "terminated",
        },
      },
    },
    displayGroup: {},

    terminated: {
      type: "final",
    },
  },
});
/*
 slotsComplete() {
      if (!context) {
        return {};
      }
      let items = context.slots;
      let results = {};

      for (const name in items) {
        results[name] = context.slots[name];
        results[name].available = context.available[name];
      }

      return slotsComplete;
    },

*/
export default {
  name: "Booking",
  components: {
    BookingSlots,
    YourBookings,
  },
  computed: {
    filteredSlots() {
      var filter = this.slotFilter.toLowerCase();
      var items = context.slots;

      items.sort((a, b) => (a.name > b.name ? 1 : -1));

      if (filter == "") {
        return items;
      }
      var results = items.filter((obj) => {
        return obj.name.toLowerCase().includes(filter);
      });

      return results;
    },
    slotsComplete() {
      console.log(context);
      return { not: "implemented" };
    },
  },
  created() {
    // Start service on component creation
    this.BookingService.onTransition((state) => {
      // Update the current state component data property with the next state
      this.current = state;
      // Update the context component data property with the updated context
      this.context = state.context;
    }).start();
  },
  data() {
    return {
      // Interpret the machine and store it in data
      BookingService: interpret(bookingMachine, {
        devTools: true,
      }).onTransition((state) => console.log(state.value)),

      // Start with the machine's initial state
      current: bookingMachine.initialState,

      // Start with the machine's initial context
      context: bookingMachine.context,
      //try to store the results somewhere where component can get them?
      results: {},
    };
  },
  methods: {
    // Send events to the service
    send(event) {
      this.BookingService.send(event);
    },
  },
};
