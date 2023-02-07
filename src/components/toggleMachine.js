import { createMachine } from "xstate";

// This machine is completely decoupled from Vue
export const toggleMachine = createMachine({
  id: "toggle",
  context: {
    /* some data */
  },
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
});
