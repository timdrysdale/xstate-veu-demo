import { assign, createMachine } from "xstate";

// This is not currently used!

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

export default function (group, token) {
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
}
