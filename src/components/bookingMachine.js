import {
  assign,
  createMachine,
  interpret,
  send,
  spawn,
  sendParent,
} from "xstate";

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

const noContentMachine = createMachine(
  {
    predictableActionArguments: true, //https://xstate.js.org/docs/guides/actions.html
    id: "loginNoContentFetch",
    initial: "loading",
    context: {
      path: import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/", //this routing is incomplete.
      method: "POST",
      token: "",
      retryCount: 0,
    },
    states: {
      loading: {
        invoke: {
          src: "fetchNoData",
          onDone: { target: "success" },
          onError: { target: "failure" },
        },
      },
      success: {
        type: "final",
        data: (context, event) => ({
          results: context.results,
          result: "success",
        }),
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
      terminated: {
        type: "final",
        data: (context, event) => ({
          results: context.results,
          result: "terminated",
        }),
      },
    },
  },
  {
    services: {
      fetchNoData: (_context, event) =>
        fetch(_context.path, {
          method: _context.method,
          headers: {
            Authorization: _context.token,
          },
        }), //don't process any JSON here, as no content expected
    },
    guards: {
      withinLimit: (context) => context.retryCount < 5,
    },
    actions: {
      incRetry: assign({ retryCount: (context) => context.retryCount + 1 }),
    },
    delays: {
      FETCH_DELAY: (context, event) => Math.pow(2.0, context.retryCount) * 500,
    },
  }
);

const fetchMachine = createMachine(
  {
    predictableActionArguments: true, //https://xstate.js.org/docs/guides/actions.html
    id: "loginFetch",
    initial: "loading",
    context: {
      path: import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/users/unique",
      method: "POST",
      token: "",
      results: "FOO",
      retryCount: 0,
    },
    states: {
      loading: {
        invoke: {
          src: "fetchData",
          onDone: { target: "success", actions: "handleData" },
          onError: { target: "failure" },
        },
      },
      success: {
        type: "final",
        data: (context, event) => ({
          results: context.results,
          result: "success",
        }),
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
      terminated: {
        type: "final",
        data: (context, event) => ({
          results: context.results,
          result: "terminated",
        }),
      },
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
    },
    delays: {
      FETCH_DELAY: (context, event) => Math.pow(2.0, context.retryCount) * 500,
    },
  }
);

const loginMachine = createMachine({
  id: "loginMachine",
  initial: "userLocal",
  context: {
    userLocal: "-",
    userRemote: "-",
    userName: "not known",
    login: "-",
    groups: "-",
    defaultGroup: "g-a",
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

function invokeFetchGroupDetails(context) {
  const { group, token } = context;

  /* TODO use state machine for this fetch as well ...?!
  const machine = fetchMachine.withContext({
    method: "GET",
    path: import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/groups/" + group,
    token: token,
  });

  return interpret(machine).onTransition((state) => {
    console.log(state.value);
	});*/
  return fetch(
    import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/groups/" + group,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  ).then((res) => res.json());
}

const createGroupDetailsMachine = (group, token) => {
  return createMachine({
    id: "group",
    initial: "loading",
    context: {
      group, // group name passed in
      token, //token passed in
      details: null,
      lastUpdated: null,
    },
    states: {
      loading: {
        invoke: {
          id: "fetchGroupDetails",
          src: invokeFetchGroupDetails,
          onDone: {
            target: "loaded",
            actions: assign({
              details: (_, event) => event.data,
              lastUpdated: () => Date.now(),
            }),
          },
          onError: "failure",
        },
      },
      loaded: {
        on: {
          REFRESH: "loading",
        },
      },
      failure: {
        on: {
          RETRY: "loading",
        },
      },
    },
  });
};

const bookingMachine = createMachine({
  id: "bookingMachine",
  initial: "login",
  context: {
    bookings: "",
    userName: "",
    token: "",
    groups: [], //groups we can choose from (includes description)
    group: null, //name of currently selected group
    groupDetails: {}, //subMachines see https://xstate.js.org/docs/tutorials/reddit.html#spawning-subreddit-actors
  },
  states: {
    login: {
      invoke: {
        src: loginMachine,
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
          target: "idle",
          actions: assign({
            bookings: (context, event) => {
              return event.data;
            },
          }),
        },
        onError: {
          target: "terminated",
        },
      },
    },
    idle: {
      on: {
        SELECT: {
          target: "selected",
          actions: assign((context, event) => {
            // Use the existing groupDetails actor if one already exists
            let group = context.groupDetails[event.name];

            if (group) {
              return {
                ...context,
                group,
              };
            }

            //Otherwise spawn a new groupDetails actor and
            // save it in the groupDetails object
            group = spawn(createGroupDetailsMachine(event.name, context.token));

            return {
              groupDetails: {
                ...context.groupDetails,
                [event.name]: group,
              },
              group,
            };
          }),
        },
      },
    },
    selected: {
      on: {
        SELECT: {
          target: "selected",
          actions: assign((context, event) => {
            // Use the existing groupDetails actor if one already exists
            let group = context.groupDetails[event.name];

            if (group) {
              return {
                ...context,
                group,
              };
            }

            //Otherwise spawn a new groupDetails actor and
            // save it in the groupDetails object
            group = spawn(createGroupDetailsMachine(event.name));

            return {
              groupDetails: {
                ...context.groupDetails,
                [event.name]: group,
              },
              group,
            };
          }),
        },
      },
    },
    terminated: {
      type: "final",
    },
  },
});

export default {
  name: "Booking",
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
