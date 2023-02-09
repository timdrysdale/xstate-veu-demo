import { assign, createMachine, interpret, send, sendParent } from "xstate";
// Invoked child machine
/*const minuteMachine = createMachine({
  id: "timer",
  initial: "active",
  states: {
    active: {
      after: {
        6000: { target: "finished" },
      },
    },
    finished: { type: "final" },
  },
});
*/

const fetchMachine = createMachine(
  {
    predictableActionArguments: true, //https://xstate.js.org/docs/guides/actions.html
    id: "fetch",
    initial: "loading",
    context: {
      path: import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/users/unique",
      method: "POST",
      token: "",
      results: [],
      retryCount: 0,
    },
    states: {
      loading: {
        invoke: {
          src: "fetchData",
          onDone: { target: "success", actions: "report" },
          onError: { target: "failure" },
        },
        on: {
          RESOLVE: "success",
          REJECT: "failure",
        },
      },
      success: {
        type: "final",
      },
      failure: {
        on: {
          always: [
            {
              target: "awaitingRetry",
              actions: "incRetry",
              cond: "withinLimit",
            },
            { target: "terminated" },
          ],
        },
      },
      awaitingRetry: {
        after: {
          FETCH_DELAY: "loading",
        },
      },
      terminated: {},
    },
  },
  {
    services: {
      fetchData: (_context, event) =>
        fetch(_context.path, {
          method: _context.method,
          headers: {
            Authorization: _context.token,
          },
        }).then((res) => res.json()),
    },
    guards: {
      withinLimit: (context) => context.retryCount < 5,
    },
    actions: {
      handleData: assign({ results: (_, event) => event.data }),
      incRetry: assign({ retryCount: (context) => context.retryCount + 1 }),
      report: sendParent((_, event) => ({
        type: "RESULTS",
        data: event.data,
      })),
    },
    delays: {
      FETCH_DELAY: (context, event) => Math.pow(2.0, context.retryCount) * 500,
    },
  }
);

const parentMachine = createMachine({
  id: "spawnParent",
  initial: "pending",
  states: {
    pending: {
      invoke: {
        src: fetchMachine,
        // The onDone transition will be taken when the
        // minuteMachine has reached its top-level final state.
        on: {
          results: {
            target: "timesUp",
          },
        },
      },
    },
    timesUp: {
      type: "final",
    },
  },
});

/*
const service = interpret(parentMachine)
  .onTransition((state) => console.log(state.value))
  .start();
// => 'pending'
// ... after 6 seconds
// => 'timesUp'
*/

export default {
  name: "SpawnFetch",
  created() {
    // Start service on component creation
    this.ParentChildService.onTransition((state) => {
      // Update the current state component data property with the next state
      this.current = state;
      // Update the context component data property with the updated context
      this.context = state.context;
    }).start();
  },
  data() {
    return {
      // Interpret the machine and store it in data
      ParentChildService: interpret(parentMachine, {
        devTools: true,
      }).onTransition((state) => console.log(state.value)),

      // Start with the machine's initial state
      current: parentMachine.initialState,

      // Start with the machine's initial context
      context: parentMachine.context,
      //try to store the results somewhere where component can get them?
      results: {},
    };
  },
  methods: {
    // Send events to the service
    send(event) {
      this.ParentChildService.send(event);
    },
  },
};
