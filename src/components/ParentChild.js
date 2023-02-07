import { createMachine, interpret, send, sendParent } from "xstate";

// Invoked child machine
const minuteMachine = createMachine({
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

const parentMachine = createMachine({
  id: "parent",
  initial: "pending",
  states: {
    pending: {
      invoke: {
        src: minuteMachine,
        // The onDone transition will be taken when the
        // minuteMachine has reached its top-level final state.
        onDone: "timesUp",
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
  name: "ParentChild",
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
      ParentChildService: interpret(parentMachine).onTransition((state) =>
        console.log(state.value)
      ),

      // Start with the machine's initial state
      current: parentMachine.initialState,

      // Start with the machine's initial context
      context: parentMachine.context,
    };
  },
  methods: {
    // Send events to the service
    send(event) {
      this.ParentChildService.send(event);
    },
  },
};
