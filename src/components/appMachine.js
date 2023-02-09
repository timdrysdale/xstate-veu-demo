import { assign, createMachine, interpret, send, sendParent } from "xstate";
import loginMachine from "./components/loginMachine.js";

const loginMachine = createMachine({
  id: "appMachine",
  initial: "login",
  context: {
    userName: "",
    token: "",
    groups: "",
    groupDetails: {},
  },
  states: {
    login: {
      invoke: {
        src: loginMachine,
        onDone: {
          target: "termianted",
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

    terminated: {
      type: final,
    },
  },
});
