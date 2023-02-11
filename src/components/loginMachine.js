import { assign, createMachine } from "xstate";
import noContentMachine from "./noContentMachine.js";
import fetchMachine from "./fetchMachine.js";

const getUserLocally = (context, event) =>
  new Promise((resolve, reject) => {
    var userName = localStorage.getItem("userName", false);
    console.log("userName", userName);
    if (userName == null) {
      return reject("no userName found");
    }
    if (userName == "") {
      return reject("no userName found");
    }

    return resolve({ status: "ok", userName: userName });
  });

const storeUserLocally = (context, event) =>
  new Promise((resolve, reject) => {
    var userName = localStorage.setItem("userName", context.userName);

    console.log("stored userName", context.userName);

    return resolve();
  });

export default createMachine({
  id: "loginMachine",
  initial: "userLocal",
  context: {
    userLocal: "-",
    userRemote: "-",
    userName: "not known",
    login: "-",
    groups: "-",
    defaultGroup: "g-everyone",
    defaultGroupAddedStatus: undefined,
  },
  states: {
    userLocal: {
      invoke: {
        src: getUserLocally,
        onDone: {
          target: "login",
          actions: assign({
            userLocal: (context, event) => {
              return event.data;
            },
            userName: (context, event) => {
              return event.data.userName;
            },
          }),
        },
        onError: {
          target: "userRemote",
        },
      },
    },

    userRemote: {
      invoke: {
        src: fetchMachine,
        data: {
          path: (context, event) =>
            import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/users/unique",
          method: "POST",
        },
        devTools: true,
        onDone: {
          target: "storeUser",
          actions: assign({
            userRemote: (context, event) => {
              return event.data;
            },
            userName: (context, event) => {
              return event.data.results.user_name;
            },
          }),
        },
        onError: {},
      },
    },

    storeUser: {
      invoke: {
        src: storeUserLocally,
        onDone: {
          target: "login",
        },
        onError: {
          target: "noFuture",
        },
      },
    },

    login: {
      invoke: {
        src: fetchMachine,
        data: {
          path: (context, event) =>
            import.meta.env.VITE_APP_BOOK_SERVER +
            "/api/v1/login/" +
            context.userName,
          method: "POST",
        },

        devTools: true,
        onDone: {
          target: "addDefaultGroup",
          actions: assign({
            login: (context, event) => {
              return event.data;
            },
            token: (context, event) => {
              return event.data.results.token;
            },
          }),
        },
        onError: {},
      },
    },
    groups: {
      invoke: {
        src: fetchMachine,
        data: {
          path: (context, event) =>
            import.meta.env.VITE_APP_BOOK_SERVER +
            "/api/v1/users/" +
            context.userName +
            "/groups",
          method: "GET",
          token: (context, event) => context.token,
        },
        devTools: true,
        onDone: {
          target: "loginDone",
          actions: assign({
            groups: (context, event) => {
              return event.data.results.groups;
            },
          }),
        },
        onError: {
          target: "addDefaultGroup",
        },
      },
    },
    addDefaultGroup: {
      invoke: {
        src: noContentMachine,
        data: {
          id: "addDefaultGroup",
          path: (context, event) =>
            import.meta.env.VITE_APP_BOOK_SERVER +
            "/api/v1/users/" +
            context.userName +
            "/groups/" +
            context.defaultGroup,
          method: "POST",
          token: (context, event) => context.token,
        },
        devTools: true,
        onDone: {
          target: "groups",
          actions: assign({
            defaultGroupAddedStatus: (context, event) => {
              return true;
            },
          }),
        },
        onError: {
          target: "noGroups",
          actions: assign({
            defaultGroupAddedStatus: (context, event) => {
              return false;
            },
          }),
        },
      },
    },

    noFuture: {
      //can't store user locally so future bookings might be lost
      type: "final",
    },
    noGroups: {
      // no groups, so nothing can be booked at the moment - need to add groups
      type: "final",
    },
    loginDone: {
      type: "final",
      data: (context, event) => ({
        userName: context.userName,
        token: context.token,
        groups: context.groups,
      }),
    },
  },
});
